import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { MONGO_COLLECTIONS } from 'src/common/constants';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
class Images extends Document {
  @Prop()
  fileName: string;

  @Prop()
  cdnLink: string;

  @Prop()
  i: number;

  @Prop({ default: null })
  alt: string;
}

@Schema()
class OptionValue extends Document {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  value: string;
}

@Schema()
class ProductOptions extends Document {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  dataField: string;

  @Prop({ type: [OptionValue] })
  values: OptionValue[];
}

@Schema({
  collection: MONGO_COLLECTIONS.PRODUCTS,
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Product extends Document {
  @Prop()
  docId: string;

  @Prop({ unique: true })
  csvProductId: string;

  @Prop()
  name: string;

  @Prop()
  manufacturerId: string;

  @Prop()
  vendorId: string;

  @Prop({
    default: 'non-inventory',
  })
  type: string;

  @Prop({ default: '' })
  shortDescription: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ default: 'members-only' })
  storefrontPriceVisibility: string;

  @Prop({ default: 'available' })
  availability: string;

  @Prop({ default: false })
  isFragile: boolean;

  @Prop({ default: 'published' })
  published: string;

  @Prop({ default: true })
  isTaxable: boolean;

  @Prop({ type: [Images] })
  images: Images[];

  @Prop({ type: [ProductOptions] })
  options: ProductOptions[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
