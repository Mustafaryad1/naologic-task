import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { CsvProductInterface } from 'src/common/interfaces/csv-interfaces/csv-product.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BULL_QUEUE_QUEUES } from 'src/common/constants';

@Injectable()
export class CsvImportService implements OnModuleInit {
  constructor(
    @InjectQueue(BULL_QUEUE_QUEUES.PRODUCTS.NAME)
    private productsQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.importProductsCsv();
  }

  async importProductsCsv(): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(
        __dirname,
        '../../../../src/products/data/images40.csv',
      );
      let counter = 0;
      fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' }))
        .on('data', (data: CsvProductInterface) => {
          this.productsQueue.add(
            BULL_QUEUE_QUEUES.PRODUCTS.JOBS.HANDLE_CSV_PRODUCT,
            data,
          );
        })
        .on('end', async () => {
          try {
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
}
