import { Schema, model } from 'mongoose';
import { IAuth } from '../interfaces/user.interface';

const authSchema = new Schema(
  {
    token: {
      type: String
    },
    passCode: {
      type: String
    },
    platform: {
      type: String
    },
    otp: {
      type: String
    },
  },
  {
    timestamps: true
  }
);

export default model<IAuth>('bank_scrapper_auth', authSchema);
