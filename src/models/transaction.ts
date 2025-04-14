import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: Date;
  category: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the model
export const Transaction = mongoose.models.Transaction || 
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction; 