import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { CsvProductInterface } from 'src/common/interfaces/csv-interfaces/csv-product.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BULL_QUEUE_QUEUES } from 'src/common/constants';

@Injectable()
export class CsvImportService {
  constructor(
    @InjectQueue(BULL_QUEUE_QUEUES.PRODUCTS.NAME)
    private productsQueue: Queue,
  ) {}

  async importProductsCsv(): Promise<void> {
    let itemBatch = [];
    let vendors = new Set();
    let products = new Set();
    return new Promise((resolve, reject) => {
      const filePath = path.join(
        __dirname,
        '../../../../src/products/data/images40.csv',
      );
      fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' }))
        .on('data', (data: CsvProductInterface) => {
          vendors.add(data.ManufacturerID);
          products.add(data.ProductID);

          if (itemBatch.length < 5000) itemBatch.push(data);
          else {
            const data = this.groupDataByProductId(itemBatch);
            this.productsQueue.add(
              BULL_QUEUE_QUEUES.PRODUCTS.JOBS.HANDLE_CSV_PRODUCT,
              data,
            );
            itemBatch = [];
          }
        })
        .on('end', async () => {
          try {
            if (itemBatch.length) {
              const data = this.groupDataByProductId(itemBatch);
              await this.productsQueue.add(
                BULL_QUEUE_QUEUES.PRODUCTS.JOBS.HANDLE_CSV_PRODUCT,
                data,
              );
              itemBatch = [];
            }
            //TODO: publish products to vendors

            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  groupDataByProductId(data: CsvProductInterface[]): any {
    const groupedData = data.reduce((acc, curr) => {
      const productId = curr.ProductID;
      if (!acc[productId]) {
        acc[productId] = [];
      }
      acc[productId].push(curr);
      return acc;
    }, {});
    return groupedData;
  }
}
