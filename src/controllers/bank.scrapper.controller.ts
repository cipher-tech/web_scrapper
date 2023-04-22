import { ISupportedBanks } from "../interfaces/supported.banks.interface"
import { supportedBanks } from "../services";

type scrapBankOptions = {
    bank: keyof ISupportedBanks,
    url: string,
}
interface IBankScrapper {
    scrapBank: (options: scrapBankOptions) => void;
}

/**
 * Bank scrapper class
 * contains all methods and properties for scrapping a bank website.
 *
 * NOTE: Use fat arrow syntax(() => {}) if you wish to use the 'this' keyword
 * using the normal function syntax (foo(){}) will cause the 'this' keyword to be undefined
 *
 * fat arrow syntax(() => {}) automatically binds the 'this' keyword.
 *
 * @returns {object} BankScrapperController
 */

export class BankScrapperController implements IBankScrapper {
    async scrapBank(options: scrapBankOptions) {
        const scrapperClass =  supportedBanks[options.bank];
        const scrapper =  await new scrapperClass();

        scrapper.run({url: options.url})
    }
}