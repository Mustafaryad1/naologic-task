import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CsvImportService } from 'src/common/services/csv/csv-parser.services';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import {
  ProductVariant,
  ProductVariantDocument,
} from './schemas/product-items.schema';
import { CsvProductInterface } from 'src/common/interfaces/csv-interfaces/csv-product.interface';

@Injectable()
export class ProductsService {
  constructor(
    private readonly csvImportService: CsvImportService,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductVariant.name)
    private productVariantModel: Model<ProductVariantDocument>,
  ) {}

  async handleUploadCSVProductsCronJob() {
    await this.csvImportService.importProductsCsv();
  }

  async updateOrCreateProduct(
    data: CsvProductInterface,
  ): Promise<ProductDocument> {
    const product = await this.productModel.findOne({
      csvProductId: data.ProductID,
    });

    if (product) {
      return this.productModel.findByIdAndUpdate(
        product._id,
        {
          name: data.ProductName,
          description: data.ProductDescription,
          manufacturerItemCode: data.ManufacturerItemCode,
          manufacturerItemId: data.ManufacturerID,
          manufacturerName: data.ManufacturerName,
          availability: data.Availability,
        },
        { new: true },
      );
    }
    return this.productModel.create({
      name: data.ProductName,
      csvProductId: data.ProductID,
      description: data.ProductDescription,
      manufacturerItemCode: data.ManufacturerItemCode,
      manufacturerItemId: data.ManufacturerID,
      manufacturerName: data.ManufacturerName,
      availability: data.Availability,
      images: [
        {
          fileName: data.ImageFileName,
          cdnLink: '',
          i: 0,
        },
      ],
    });
  }

  async createItem(data: CsvProductInterface, product: Product) {
    return this.productVariantModel.create({
      product: product._id,
      manufacturerItemId: data.ItemID,
      manufacturerItemCode: data.ManufacturerItemCode,
      cost: data.UnitPrice,
      price: data.UnitPrice,
      packaging: data.PKG,
      currency: 'USD',
      description: data.ItemDescription,
      attributes: {
        packaging: data.PKG,
        description: data.ItemDescription,
      },
      sku: data.NDCItemCode,
      images: [
        {
          fileName: data.ImageFileName,
          cdnLink: data.ItemImageURL,
          i: 0,
        },
      ],
    });
  }
}
