import puppeteer, { Browser, Page } from 'puppeteer';
import config from '../../config';

type BankOfOkraOptions = {
    url: string
}
/**
 * Bank-of-okra scrapper service class
 * contains all methods and properties to scrap bank-Of-Okra.
 *
 * NOTE: Use fat arrow syntax(() => {}) if you wish to use the 'this' keyword
 * using the normal function syntax (foo(){}) will cause the 'this' keyword to be undefined
 *
 * fat arrow syntax(() => {}) automatically binds the 'this' keyword.
 *
 * @returns {object} BankOfOkraScrapperService
 */
export class BankOfOkraScrapperService {
    browser: Browser
    page: Page
    url: string

    private async createBrowser() {
        this.browser = await puppeteer.launch({
            executablePath: '/usr/local/bin/chromium',
            headless: true,
            args: [ "--no-sandbox", "--disabled-setupid-sandbox" ],
        });
        this.page = await this.browser.newPage();
    }

    async authenticateUser(page: Page) {
        // click the login button
        await page.click('[href="/login"]')

        // fill out the form 
        // enter email
        await page.type('#email', (config?.EMAIL || ""));
        // enter password
        await page.type('#password', (config?.PASSWORD || ""));
        // submit form
        await page.click('[type="submit"]')

        // dismiss dialog
        await page.on('dialog', async dialog => {
            await dialog.dismiss();
        });

        // enter opt
        await this.page.waitForSelector("#otp");
        await this.page.type('#otp', (config?.OTP || ""));

        // click submit  
        await this.page.click('[type="submit"]')
        return true;
    }

    async getCustomerDetails(page: Page) {
        const customer: any = {}

        // get customer name
        const customerName = await page.$$('[class="text-2xl font-semibold text-gray-800"]');

        for (let text of customerName) {
            customer.name = await page.evaluate(el => el.innerHTML, text)
        }

        // get other customer information
        const customerInfo = await page.$$('div > [class="text-default my-3"]');

        customer.address = await page.evaluate(el => el.textContent, customerInfo[ 0 ])
        customer.bvn = await page.evaluate(el => el.textContent, customerInfo[ 1 ])
        customer.phone_no = await page.evaluate(el => el.textContent, customerInfo[ 2 ])
        customer.email = await page.evaluate(el => el.textContent, customerInfo[ 3 ])

        return customer
    }
    async run(options: BankOfOkraOptions) {
        await this.createBrowser()
        this.url = options.url;
        // go to website
        await this.page.goto(this.url);

        // Set screen size
        await this.page.setViewport({ width: 1366, height: 768 });
        // authenticate user
        await this.authenticateUser(this.page)

        await this.page.waitForNavigation()
        await this.page.waitForSelector('[class="text-2xl font-semibold text-gray-800"]');
        const customer = await this.getCustomerDetails(this.page)

        return {customer}
    }

}