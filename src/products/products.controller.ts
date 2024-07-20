import { Controller, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleUploadCSVProductsCronJob() {
    this.logger.debug('Start uploading products from csv file');
    this.productsService.handleUploadCSVProductsCronJob();
  }
}
