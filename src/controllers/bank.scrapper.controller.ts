import { Response } from 'express';
import { supportedBanks } from "../services";
import { IRequestWithAuth } from '../middleware/auth.middleware';
import { ResponseHandler } from '../util/response.handler';

/**
 * Bank scrapper class
 * contains all methods and properties for scrapping a bank website.
 *
 * @returns {object} BankScrapperController
 */
export class BankScrapperController {
    async scrapBank(req: IRequestWithAuth, res: Response) {
        try {
            if (!req?.options?.bank || !req.auth) {
                throw new Error("Something went wrong, please try again.")
            }
            // get scrapper service for a particular bank
            const scrapperClass = supportedBanks[ req.options.bank ];
            const scrapper = await new scrapperClass();

            // scrap the test website
            const result = await scrapper.run({ auth: req.auth, ...req.options })

            const response = new ResponseHandler(req, res);

            return  response.success({
                message: "Registration successful",
                data: result
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json("Could not scrap test bank, please try again.")
        }
    }
}