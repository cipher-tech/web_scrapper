import AuthModel from "../../models/auth.model";
import { BankFormatter } from "../../services/formatter/bank.formatter.service";
import HashText from "../../util/hashText.helper";

export class CustomerAuthService {
    async authenticateCustomer(token: string, passCode: string, platform: string) {
        if (!passCode || !token) {
            throw new Error("passCode and token are required");
        }
        const auth = await AuthModel.findOne({ token: token.toLowerCase(), platform }).exec();

        if (!auth?.token) {
            const formatter = new BankFormatter()
            const newAuth = new AuthModel(await formatter.authFormatter({ token, passCode, platform }))
            newAuth.save();
            return newAuth;
        }
        // if user details saved already but passwords do not match, update password
        const doesPasswordMatch = await HashText.verifyHash(passCode, auth.passCode);
        if (!doesPasswordMatch) {
            auth.passCode = await HashText.getHash(passCode);
            auth.save();
        }
        return auth
    }
}