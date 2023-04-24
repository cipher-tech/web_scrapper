import { Model, Schema, model } from 'mongoose';
import { ICustomer } from '../interfaces/user.interface';

interface IUserModel extends Model<ICustomer> {
    createCustomer: (options: ICustomer) => Promise<ICustomer>
}
const customerSchema = new Schema(
  {
    auth: [{
      type: Schema.Types.ObjectId, ref: "bank_scrapper_auth"
    }],
    name: {
      type: String
    },
    address: {
      type: String
    },
    bvn: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    email: {
      type: String
    },
  },
  {
    timestamps: true,
    statics: {
        // create a new user if the user doesn't exist if not, update the auth for that user'
        async createCustomer(options: ICustomer) {
            let customer = await this.findOne({bvn: options.bvn}).exec()
            if(customer === null){
                await this.create(options)
                return this.findOne({bvn: options.bvn}).exec()
            }

            if(options?.auth){
                await customer.updateOne({$addToSet: {auth: options.auth}})
            }
            return customer
        }
    }
  }
);

export default model<ICustomer, IUserModel>('bank_scrapper_customer', customerSchema);
