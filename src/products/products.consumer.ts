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
        const items = Object.values(job.data);

        await Promise.all(
          items.map((csvProduct: CsvProductInterface[]) => {
            return this.productService.createItems(csvProduct);
          }),
        );
      }
      default: {
        break;
      }
    }
  }
}
