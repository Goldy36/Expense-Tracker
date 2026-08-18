import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a transaction title'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero']
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Transaction type must be income or expense']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      index: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Please specify a date'],
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
      default: 'UPI'
    },
    description: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    receiptUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexing for efficient user-specific queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
