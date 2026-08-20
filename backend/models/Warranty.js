// server/models/Warranty.js
import mongoose from 'mongoose';

const warrantySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productName: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Home Appliances', 'Kitchen', 'Travel', 'Furniture', 'Other'],
    },
    purchaseDate: { type: Date, required: true },
    warrantyExpiryDate: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    receiptUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Warranty', warrantySchema);