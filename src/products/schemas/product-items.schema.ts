import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { MONGO_COLLECTIONS } from 'src/common/constants';
import { Product } from './product.schema';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({
  collection: MONGO_COLLECTIONS.PRODUCTS_VARIANTS,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class ProductVariant extends Document {
  @Prop()
  id: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop()
  available: boolean;

  @Prop({ type: Object })
  attributes: {
    packaging: string;
    description: string;
  };

  @Prop()
  cost: number;

  @Prop()
  currency: string;

  @Prop()
  depth: number | null;

  @Prop()
  description: string;

  @Prop()
  dimensionUom: string | null;

  @Prop()
  height: number | null;

  @Prop()
  width: number | null;

  @Prop()
  manufacturerItemCode: string;

  @Prop()
  manufacturerItemId: string;

  @Prop()
  packaging: string;

  @Prop()
  price: number;

  @Prop()
  volume: number | null;

  @Prop()
  volumeUom: string | null;

  @Prop()
  weight: number | null;

  @Prop()
  weightUom: string | null;

  @Prop()
  optionName: string;

  @Prop()
  optionsPath: string;

  @Prop()
  optionItemsPath: string;

  @Prop()
  sku: string;

  @Prop()
  active: boolean;

  @Prop({
    type: [{ fileName: String, cdnLink: String, i: Number, alt: String }],
  })
  images: Array<{
    fileName: string;
    cdnLink: string | null;
    i: number;
    alt: string | null;
  }>;

  @Prop()
  itemCode: string;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
