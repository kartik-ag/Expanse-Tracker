import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  budget?: number;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      default: '#6366F1', // Default indigo color
    },
    budget: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: 'tag',
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export const Category = mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category; 