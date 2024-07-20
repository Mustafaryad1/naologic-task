import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { BULL_QUEUE_QUEUES } from 'src/common/constants';
import { CsvImportService } from 'src/common/services/csv/csv-parser.services';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: BULL_QUEUE_QUEUES.PRODUCTS.NAME,
      defaultJobOptions: BULL_QUEUE_QUEUES.PRODUCTS.OPTIONS,
    }),
  ],
  providers: [CsvImportService],
  exports: [CsvImportService],
})
export class GlobalModule {}
