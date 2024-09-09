import { Schema } from "mongoose";

interface ITransaction {
    amount: number;
    description: string;
    date: Date;
    transactionType: 'credit' | 'debit';
  }

  interface IWallet extends Document {
    userId: Schema.Types.ObjectId;
    balance: number;
    transactions: ITransaction[];
    createdAt: Date;
    updatedAt: Date;
  }

  export default IWallet;