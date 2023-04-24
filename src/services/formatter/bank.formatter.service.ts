import { IAccount, IAccountScrapTemplate, IAuth, ICustomer, ICustomerScrapTemplate, ITransaction } from "../../interfaces/user.interface";
import HashText from "../../util/hashText.helper";
import { replaceSpecialCharacters, getNumbers } from "../../util/replace.string.util";

type AuthFormatter = {
    token: string;
    passCode: string;
    platform: string;
}
type TransactionFormatter = {
    customer: ICustomer
    account: IAccount,
    transaction: Partial<ITransaction>
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
    customerFormatter(options: Partial<ICustomerScrapTemplate>, auth: IAuth): ICustomer {
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
            name: replaceSpecialCharacters(name ? name : `${ firstName } ${ lastName }`).toLowerCase(),
            //if address is combined continue else merge apartmentNumber, street, state and country
            address: replaceSpecialCharacters(address ? address : `${ apartmentNumber } ${ street } ${ state } ${ country }`).toLowerCase(),
            bvn: replaceSpecialCharacters(bvn).toLowerCase(),
            phoneNumber: replaceSpecialCharacters(phoneNumber).toLowerCase(),
            email: email.toLowerCase(),
            auth: auth._id
        }
    }
    accountFormatter(account: Partial<IAccountScrapTemplate>[], customer: ICustomer): IAccount[] {
        const accountDetails = account.map(account => {
            let currency: string, symbol: string
            if (String(account?.accountBalance).includes("$")) {
                currency = "USD"
                symbol = "$"
            } else {
                currency = "NGN"
                symbol = "₦"
            }
            return {
                customer: customer._id,
                title: account!.title || "",
                accountBalance: parseFloat(getNumbers(`${ account.accountBalance }`)),
                ledgerBalance: parseFloat(getNumbers(`${ account.ledgerBalance }`)),
                accountType: account.title || "",
                bank: account.bank || "",
                currency,
                symbol,
            }

        })
        return accountDetails
    }

    transactionFormatter(options: TransactionFormatter): ITransaction {
        return {
            transactionType: options.transaction.transactionType || "",
            account: options.account._id,
            customer: options.customer._id,
            approvalDate: new Date(options.transaction.approvalDate || "").toISOString(),
            description: options.transaction.description || "",
            amount: options.transaction.amount || 0,
            destinationId: options.transaction.destinationId || "",
            senderId:  options.transaction.senderId || '',
            status: options.transaction.status || '',
            billerId: options.transaction.billerId || '',
            tax: options.transaction.tax || 0,
            totalPayment: (options.transaction.tax || 0) + (options.transaction.amount || 0),
            paymentMethod: options.transaction.paymentMethod || '',
            paymentMethodId: options.transaction.paymentMethodId || '',
            eventId: options.transaction.eventId || '',
            sourceBankId: options.transaction.sourceBankId || '',
            destinationBankId: options.transaction.destinationBankId || '',
        }
    }
}