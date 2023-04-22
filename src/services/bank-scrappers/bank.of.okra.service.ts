import puppeteer, { Browser, Page } from 'puppeteer';

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

    async run(options: BankOfOkraOptions) {
        await this.createBrowser()
        this.url = options.url;
        await this.page.goto(this.url);
    }

}