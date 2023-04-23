import { IAccount } from "../../interfaces/user.interface";
import HashText from "../../util/hashText.helper";
import { replaceString } from "../../util/replace.string.util";

type AuthFormatter = {
    token: string;
    passCode: string;
    platform: string;
}
interface accountFormatter {
    customerName: string;
    title: string;
    amount: string;
    ledgerBalance: string;
    accountType: string;
    bank: string;
}
export class BankFormatter {
    async authFormatter(options: AuthFormatter) {
        const {token, passCode, platform} = options
        return {
            token, 
            passCode: await HashText.getHash(passCode),
            otp: 12345, 
            platform
        }
    }
    accountFormatter(account: accountFormatter): IAccount {
        const { title, amount, ledgerBalance, accountType, bank } = account
        return {
            title,
            amount: Number(replaceString(amount, "$", '')),
            ledgerBalance: Number(replaceString(ledgerBalance, "$", '')),
            accountType,
            bank,
            currency: amount.includes("$") ? "USD" : "NGN",
            symbol: amount.includes("$") ? "$" : "N",
        }
    }
}