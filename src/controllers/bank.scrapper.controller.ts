import { ISupportedBanks } from "../interfaces/supported.banks.interface"
import { supportedBanks } from "../services";
import { CustomerAuthService } from "../services/bank-scrappers/auth.custormer.service";

export interface IScrapBankOptions {
    bank: keyof ISupportedBanks,
    url: string,
    token: string,
    passCode: string
}
interface IBankScrapper {
    scrapBank: (options: IScrapBankOptions) => void;
}

/**
 * Bank scrapper class
 * contains all methods and properties for scrapping a bank website.
 *
 * @returns {object} BankScrapperController
 */

export class BankScrapperController implements IBankScrapper {
    async scrapBank(options: IScrapBankOptions) {
        const customerAuth = new CustomerAuthService()
        const auth = await customerAuth.authenticateCustomer(options.token, options.passCode, options.bank)

        // get scrapper service for a particular bank
        const scrapperClass = supportedBanks[ options.bank ];
        const scrapper = await new scrapperClass();

        scrapper.run({ auth, ...options })
    }
}