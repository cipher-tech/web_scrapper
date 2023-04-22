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
    async run(options: BankOfOkraOptions) {
        await this.createBrowser()
        this.url = options.url;
        // go to website
        await this.page.goto(this.url);

        // Set screen size
        await this.page.setViewport({ width: 1366, height: 768 });
        // authenticate user
        this.authenticateUser(this.page)
    }

}