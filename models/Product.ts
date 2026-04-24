import mongoose, { Schema, Document, model } from 'mongoose';

// 1. Define the Interface (for TypeScript)
export interface IPerfume extends Document {
  name: string;
  brand: string;
  price: number;
  category: string;
  isFeatured?: boolean;
  heroImage?: string;
  // add any other fields you have in Atlas
}

// 2. Define the Schema
const perfumeSchema = new Schema<IPerfume>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  heroImage: { type: String }
});

// 3. The "Fix": Force it to use the 'perfumes' collection
// This ensures Mongoose doesn't accidentally create a 'products' folder
export default mongoose.models.Perfume || model<IPerfume>('Perfume', perfumeSchema, 'perfumes');