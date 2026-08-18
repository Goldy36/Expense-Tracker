import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false // Do not include password in queries by default
    },
    profileImage: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: '₹'
    },
    preferences: {
      defaultDateRange: { type: String, default: '30 Days' },
      defaultTransactionType: { type: String, default: 'all' },
      notifications: {
        budgetAlerts: { type: Boolean, default: true },
        weeklySummary: { type: Boolean, default: true },
        monthlyReport: { type: Boolean, default: true }
      }
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
