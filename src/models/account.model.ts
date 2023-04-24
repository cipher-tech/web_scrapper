import { Model, Schema, model } from 'mongoose';
import { IAccount } from '../interfaces/user.interface';

interface IAccountModel extends Model<IAccount> {
    createAccount: (options: IAccount[]) => IAccount[]
}
const accountSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId, ref: "bank_scrapper_customer"
        },
        title: {
            type: String
        },
        accountBalance: {
            type: Number
        },
        ledgerBalance: {
            type: Number
        },
        currency: {
            type: String
        },
        symbol: {
            type: String
        },
        bank: {
            type: String
        },
        accountNumber: {
            type: String
        },
        accountType: {
            type: String
        },
    },
    {
        timestamps: true,
        statics: {
            // create a new account if the account doesn't exist if not, update the account'
            async createAccount(options: IAccount[]) {
                try {
                    await this.bulkWrite(
                        options.map((acct) =>
                        ({
                            updateOne: {
                                filter: {
                                    customer: (acct.customer) as any,
                                    accountType: acct.accountType,
                                    bank: acct.bank,
                                    title: acct.title
                                },
                                update: { $set: { ...acct, customer: (acct.customer) as any } },
                                upsert: true
                            }
                        })
                        )
                    )
                    const account = await this.find({customer: options[0].customer})
                    return account
                } catch (error) {
                    console.log(error);
                    throw new Error("Could not insert account information")
                }
            }
        }
    }
);

export default model<IAccount, IAccountModel>('bank_scrapper_account', accountSchema);
