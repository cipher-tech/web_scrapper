import { ISupportedBanks } from "../interfaces/supported.banks.interface";
import { BankOfOkraScrapperService } from "./bank-scrappers/bank.of.okra.service";

export const supportedBanks: ISupportedBanks = {
    bank_of_okra: BankOfOkraScrapperService
}