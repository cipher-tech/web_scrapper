import { BankOfOkraScrapperService } from "../services/bank-scrappers/bank.of.okra.service";

export interface ISupportedBanks {
    bank_of_okra: typeof BankOfOkraScrapperService,
}