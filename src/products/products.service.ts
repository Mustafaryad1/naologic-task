import { Injectable } from '@nestjs/common';
import { CsvImportService } from 'src/common/services/csv/csv-parser.services';

@Injectable()
export class ProductsService {
  constructor(private readonly csvImportService: CsvImportService) {}

  async handleUploadCSVProductsCronJob() {
    await this.csvImportService.importProductsCsv();
  }
}
