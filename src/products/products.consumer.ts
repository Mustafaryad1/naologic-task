import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BULL_QUEUE_QUEUES } from 'src/common/constants';

@Processor(BULL_QUEUE_QUEUES.PRODUCTS.NAME)
export class ProductsConsumer extends WorkerHost {
  async process(job: Job): Promise<any> {
    switch (job.name) {
      case BULL_QUEUE_QUEUES.PRODUCTS.JOBS.CREATE_PRODUCT: {
        
        return {};
      }
      default: {
        return {};
      }
    }
  }
}
