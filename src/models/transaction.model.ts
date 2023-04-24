import { Model, Schema, model } from 'mongoose';
import { ITransaction } from '../interfaces/user.interface';

type createTransactionProps = {
    [ key: string ]: ITransaction[]
}
interface ITransactionModel extends Model<ITransaction> {
    createTransaction: (options: createTransactionProps) => ITransaction[]
}
const TransactionSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId, ref: "bank_scrapper_customer"
        },
        account: {
            type: Schema.Types.ObjectId, ref: "bank_scrapper_account"
        },
        transactionType: {
            type: String
        },
        approvalDate: {
            type: String
        },
        description: {
            type: String
        },
        amount: {
            type: Number
        },
        destinationId: {
            type: String
        },
        senderId: {
            type: String
        },
        status: {
            type: String
        },
        billerId: {
            type: String
        },
        tax: {
            type: Number
        },
        totalPayment: {
            type: Number
        },
        paymentMethod: {
            type: String
        },
        paymentMethodId: {
            type: String
        },
        eventId: {
            type: String
        },
        sourceBankId: {
            type: String
        },
        destinationBankId: {
            type: String
        },
    },
    {
        timestamps: true,
        statics: {
            // create a new transaction if the transaction doesn't exist if not, update the transaction'
            async createTransaction(options: createTransactionProps) {
                try {
                    const transactions = Object.values(options)

                    for (let transaction of transactions) {
                        await this.bulkWrite(
                            transaction.map((item) =>
                            ({
                                updateOne: {
                                    filter: {
                                        customer: item.customer,
                                        account: item.account,
                                        transactionType: item.transactionType,
                                        approvalDate: item.approvalDate,
                                        description: item.description,
                                        amount: item.amount,
                                        destinationId: item.destinationId,
                                        senderId: item.senderId,
                                        status: item.status,
                                    },
                                    update: { $set: { ...item, customer: (item.customer) as any, account: (item.account) as any } },
                                    upsert: true
                                }
                            })
                            )
                        )
                    }
                    return await this.find({ customer: transactions[ 0 ][ 0 ].customer })
                } catch (error) {
                    console.log(error);
                    throw new Error("Could not insert account information")
                }
            }
        }
    }
);

export default model<ITransaction, ITransactionModel>('bank_scrapper_transaction', TransactionSchema);
