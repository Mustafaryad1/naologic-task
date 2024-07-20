import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BULL_QUEUE_QUEUES } from 'src/common/constants';
import { CsvProductInterface } from 'src/common/interfaces/csv-interfaces/csv-product.interface';
import { ProductsService } from './products.service';

@Processor(BULL_QUEUE_QUEUES.PRODUCTS.NAME)
export class ProductsConsumer extends WorkerHost {
  constructor(private readonly productService: ProductsService) {
    super();
  }

  async process(job: Job): Promise<any> {
    switch (job.name) {
      case BULL_QUEUE_QUEUES.PRODUCTS.JOBS.HANDLE_CSV_PRODUCT: {
        const data: CsvProductInterface = job.data;
        if (data.IsDeleted) {
          //handle delete operation
        } else {
          const product = await this.productService.updateOrCreateProduct(data);
          await this.productService.createItem(data, product);
        }
      }
      default: {
        break;
      }
    }
  }
}
