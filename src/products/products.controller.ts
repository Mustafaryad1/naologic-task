import { Controller, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Cron } from '@nestjs/schedule';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Cron('45 * * * * *')
  handleUploadCSVProductsCronJob() {
    this.logger.debug('Start uploading products from csv file');
    this.productsService.handleUploadCSVProductsCronJob();
  }
}
