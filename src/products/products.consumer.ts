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
        const items: CsvProductInterface[] = Object.values(
          job.data,
        ).flat() as CsvProductInterface[];

        await Promise.all(
          items.map((csvProduct) => {
            return this.productService.createItem(csvProduct);
          }),
        );
      }
      default: {
        break;
      }
    }
  }
}
