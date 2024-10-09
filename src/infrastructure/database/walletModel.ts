import mongoose, { Model, Schema } from "mongoose";
import IWallet from "../../domain/wallet";

const walletSchema: Schema<IWallet> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    transactions: [
      {
        amount: Number,
        description: String,
        date: {
          type: Date,
          default: Date.now,
        },
        transactionType: {
          type: String,
          enum: ["credit", "debit"],
        },
      },
    ],
  },
  { timestamps: true }
);

const WalletModel: Model<IWallet> = mongoose.model<IWallet>(
  "Wallet",
  walletSchema
);

export default WalletModel;
