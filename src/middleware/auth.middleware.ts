import { Request, Response, NextFunction } from 'express';
import { CustomerAuthService } from '../services/bank-scrappers/auth.custormer.service';
import config from '../config';
import { ISupportedBanks } from '../interfaces/supported.banks.interface';
import { IAuth } from '../interfaces/user.interface';
import logger from '../config/logger';

export interface IScrapBankOptions {
    bank: keyof ISupportedBanks,
    url: string,
    token: string,
    passCode: string
}
export interface IRequestWithAuth extends Request{
    options?: IScrapBankOptions, 
    auth?: IAuth
}
/**
 * Middleware to save user authentication details  
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const authMiddleware = async (
    req: IRequestWithAuth,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info("Building user auth details")
        const options: IScrapBankOptions = { 
            bank: "bank_of_okra",
            url: config?.TEST_URL || 'https://bankof.okra.ng',
            token: req?.body?.token || config?.EMAIL,
            passCode: req?.body?.passCode || config?.PASSWORD,
        } 
        
        const customerAuth = new CustomerAuthService()
        const auth = await customerAuth.authenticateCustomer(options.token, options.passCode, options.bank)
        
        req.options = options
        req.auth = auth
        logger.info("Finish building user auth details")
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
