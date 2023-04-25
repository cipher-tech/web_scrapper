import { Request, Response } from "express";
import config from "../config";

/**
 * Applications response handler class
 * Handles both success and error responses using well defined methods
 * @param {object} req express request object
 * @param {object} res express response object
 *
 * @returns {object} response
 */
export class ResponseHandler {
    domain?: string;
    environment
    request
    res
    constructor(req: Request, res: Response) {
        this.domain = config?.DOMAIN;
        this.environment = config?.ENVIRONMENT;
        this.request = req;
        this.res = res;
    }

    /**
     * Method to Handles success responses to ensure consistency
     * @param {object} options - {message, data}
     *
     * @returns {object} - success response
     */
    success(options: any) { 
        const { message, data } = options;
        const currentUrl = `${ this.domain }${ this.request.originalUrl }`;
        const status = "success";

        const response = {
            currentUrl,
            message,
            data,
            status
        };

        return this.res.status(200).json(response);
    }
}

export default Response;
