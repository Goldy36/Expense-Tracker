import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required for budget'],
      trim: true
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit amount is required'],
      min: [1, 'Limit must be at least 1']
    },
    month: {
      type: Number, // 0 - 11
      required: true,
      default: () => new Date().getMonth()
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear()
    },
    startDate: {
      type: String,
      default: () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    },
    endDate: {
      type: String,
      default: () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    }
  },
  {
    timestamps: true
  }
);

// Compound index to enforce one budget per category per user per month
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
