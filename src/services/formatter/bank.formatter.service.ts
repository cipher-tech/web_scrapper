import { IAccount, ICustomer, ICustomerScrapTemplate } from "../../interfaces/user.interface";
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
export class Formatter {
    async authFormatter(options: AuthFormatter) {
        const { token, passCode, platform } = options
        return {
            token,
            passCode: await HashText.getHash(passCode),
            otp: 12345,
            platform
        }
    }
    customerFormatter(options: Partial<ICustomerScrapTemplate>): ICustomer {
        const {
            firstName,
            lastName,
            name,
            bvn = "",
            phoneNumber = "",
            address,
            apartmentNumber,
            street,
            state,
            country,
            email = "" } = options
        return {
            //if name is already combined continue else merge first and last name
            name: name ? name.trim() : `${ firstName } ${ lastName }`.trim(),
            //if address is combined continue else merge apartmentNumber, street, state and country
            address: address ? address.trim() : `${ apartmentNumber } ${ street } ${ state } ${ country }`.trim(),
            bvn: bvn.trim(),
            phoneNumber: phoneNumber.trim(),
            email: email.trim()
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