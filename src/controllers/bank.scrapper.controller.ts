import { ISupportedBanks } from "../interfaces/supported.banks.interface"
import { supportedBanks } from "../services";
import { CustomerAuthService } from "../services/bank-scrappers/auth.custormer.service";

type scrapBankOptions = {
    bank: keyof ISupportedBanks,
    url: string,
    token: string,
    passCode: string
}
interface IBankScrapper {
    scrapBank: (options: scrapBankOptions) => void;
}

/**
 * Bank scrapper class
 * contains all methods and properties for scrapping a bank website.
 *
 * @returns {object} BankScrapperController
 */

export class BankScrapperController implements IBankScrapper {
    async scrapBank(options: scrapBankOptions) {
        const customerAuth = new CustomerAuthService()
        const auth = await customerAuth.authenticateCustomer(options.token, options.passCode, options.bank)

        const scrapperClass = supportedBanks[ options.bank ];
        const scrapper = await new scrapperClass();

        scrapper.run({ url: options.url, bank: options.bank })
    }
}