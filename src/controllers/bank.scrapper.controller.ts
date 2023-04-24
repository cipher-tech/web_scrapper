import { Request, Response } from 'express';
import config from "../config";
import { ISupportedBanks } from "../interfaces/supported.banks.interface"
import { supportedBanks } from "../services";
import { CustomerAuthService } from "../services/bank-scrappers/auth.custormer.service";

export interface IScrapBankOptions {
    bank: keyof ISupportedBanks,
    url: string,
    token: string,
    passCode: string
}

/**
 * Bank scrapper class
 * contains all methods and properties for scrapping a bank website.
 *
 * @returns {object} BankScrapperController
 */

export class BankScrapperController{
    async scrapBank(req: Request, res: Response) {
        try {
            console.log("::::::::: req scrap_test_bank", req.body);
            const options: IScrapBankOptions = { 
                bank: "bank_of_okra",
                url: config?.TEST_URL || 'https://bankof.okra.ng',
                token: req?.body?.token || config?.EMAIL,
                passCode: req?.body?.passCode || config?.PASSWORD,
            } 
            
            const customerAuth = new CustomerAuthService()
            const auth = await customerAuth.authenticateCustomer(options.token, options.passCode, options.bank)
    
            // get scrapper service for a particular bank
            const scrapperClass = supportedBanks[ options.bank ];
            const scrapper = await new scrapperClass();
    
            const result = await scrapper.run({ auth, ...options })
    
            return res.json(result) 
        } catch (error) {
            console.log(error);
            return res.status(500).json("Could not scrap test bank, please try again.")
        }
    }
}