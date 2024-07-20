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

  async createItems(data: CsvProductInterface[]) {
    const product = await this.updateOrCreateProduct(data[0]);

    return this.productVariantModel.insertMany(
      data.map((item) => ({
        product: product._id,
        manufacturerItemId: item.ItemID,
        manufacturerItemCode: item.ManufacturerItemCode,
        cost: item.UnitPrice,
        price: item.UnitPrice,
        packaging: item.PKG,
        currency: 'USD',
        description: item.ItemDescription,
        attributes: {
          packaging: item.PKG,
          description: item.ItemDescription,
        },
        sku: item.NDCItemCode,
        images: [
          {
            fileName: item.ImageFileName,
            cdnLink: item.ItemImageURL,
            i: 0,
          },
        ],
      })),
      { ordered: true },
    );
  }
}
