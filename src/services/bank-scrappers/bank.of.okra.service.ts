import puppeteer, { Browser, Page } from 'puppeteer';
import config from '../../config';
import { IAccount, ICustomer } from '../../interfaces/user.interface';
import { replaceString } from '../../util/replace.string.util';

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
        try {
            this.browser = await puppeteer.launch({
                executablePath: '/usr/local/bin/chromium',
                headless: true,
                args: [ "--no-sandbox", "--disabled-setupid-sandbox" ],
            });
            this.page = await this.browser.newPage();
        } catch (error) {
            console.log(error);
            throw "Could not initialize browser"
        }
    }

    async authenticateUser(page: Page) {
        try {
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
        } catch (error) {
            console.log(error);
            throw "Could not authenticate customer"
        }
    }

    async getCustomerDetails(page: Page) {
        try {
            let customer: ICustomer = {
                name: "",
                address: "",
                bvn: "",
                phone_no: "",
                email: "",
            }
            // get customer name
            const customerName = await page.$$('[class="text-2xl font-semibold text-gray-800"]');

            for (let text of customerName) {
                customer.name = await page.evaluate(el => el.innerHTML, text) || ""
            }

            // get other customer information
            const customerInfo = await page.$$('div > [class="text-default my-3"]');

            customer.address = await page.evaluate(el => el.textContent, customerInfo[ 0 ]) || ''
            customer.bvn = await page.evaluate(el => el.textContent, customerInfo[ 1 ]) || ""
            customer.phone_no = await page.evaluate(el => el.textContent, customerInfo[ 2 ]) || ""
            customer.email = await page.evaluate(el => el.textContent, customerInfo[ 3 ]) || ""

            return customer
        } catch (error) {
            console.log(error);
            throw "Could not get customer information"
        }
    }

    async getAccountInformation(page: Page) {
        try {
            const account: IAccount[] = []

            // get user account information
            const accountInfo = await page.$$('section.rounded');

            for (let acct of accountInfo) {
                const title = await page.evaluate(el => el.querySelector('div > h3')?.textContent, acct) || ""
                const amount = (await page.evaluate(el => el.querySelector('div > p.font-bold')?.textContent, acct)) || ""
                const balance = await page.evaluate(el => el.querySelector('p:nth-child(2)')?.textContent, acct) || ""

                // replace special characters
                account.push({
                    title,
                    amount: Number(replaceString(amount, "$", '')),
                    balance: Number(replaceString(balance, "$", '')),
                    transactions: []
                })
            }
            return account
        } catch (error) {
            console.log(error);
            throw "Could not retrieve account information."
        }
    }

    async getTransactions(page: Page, accountInformation: IAccount[]) {
        try {
            const accountButtonSelector = 'div > a[href^="/account"]'
            // get button link to each account transaction
            const accountButtons = await page.$$(accountButtonSelector);

            for (let i = 1; i <= accountButtons.length; i++) {
                // create an array to store transactions to the corresponding account
                accountInformation[ i - 1 ].transactions = []
                // click link to display account transaction
                await page.waitForSelector('[class="flex-1 w-full"] a.rounded');

                await page.click(`section[class~="w-4/5"]:nth-child(${ i + 1 }) > ${ accountButtonSelector }`)
                // wait for transactions to appear
                await page.waitForSelector('tbody > tr');

                // get all rendered transactions
                const transactions = await page.$$('[class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"]');
                // get number of transactions being we have displayed so far e.g 30 of 448
                let totalVisitedTransactions = await page.$eval('[class="font-semibold text-gray-900 dark:text-white"]:nth-child(2)', el => el.textContent);
                // get total number of transactions
                const totalTransactions = await page.$eval('[class="font-semibold text-gray-900 dark:text-white"]:nth-child(3)', el => el.textContent);

                // fetch a limited amount of transactions when in development
                const limit = config?.ENVIRONMENT === 'development' ? 10 : +(totalTransactions || 0)
                // loop through the transactions displayed and add each one too the object
                while (totalVisitedTransactions && +totalVisitedTransactions <= limit) {
                    // get transaction details
                    for (const transaction of transactions) {
                        // get transaction type
                        let type = await page.evaluate(el => el.querySelector('th:nth-child(1)')?.textContent, transaction) || ""
                        // get transaction date
                        let date = await page.evaluate(el => el.querySelector('td:nth-child(2)')?.textContent, transaction) || ""
                        // get transaction description
                        let description = await page.evaluate(el => el.querySelector('td:nth-child(3)')?.textContent, transaction) || ""
                        // get transaction amount
                        let amount = await page.evaluate(el => el.querySelector('td:nth-child(4)')?.textContent, transaction) || ""
                        // get transaction beneficiary
                        let beneficiary = await page.evaluate(el => el.querySelector('td:nth-child(5)')?.textContent, transaction) || ""
                        // get transaction sender
                        let sender = await page.evaluate(el => el.querySelector('td:nth-child(6)')?.textContent, transaction) || ""

                        // add transactions to account information
                        accountInformation[ i - 1 ].transactions.push({
                            type,
                            date,
                            description,
                            amount: Number(replaceString(amount, "$", '')),
                            beneficiary,
                            sender
                        })
                    }
                    // click the next button
                    await page.click('[class="inline-flex mt-2 xs:mt-0"] > button:nth-child(2)')
                    // wait for page to load
                    await page.waitForSelector('[class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"]');
                    totalVisitedTransactions = await page.$eval('[class="font-semibold text-gray-900 dark:text-white"]:nth-child(2)', el => el.textContent);
                }
                // go back to previous page
                await page.goBack();
            }
            return accountInformation
        } catch (error) {
            console.log(error);
            throw "Could not get customer transactions"
        }
    }
    async run(options: BankOfOkraOptions) {
        try {
            await this.createBrowser()
            this.url = options.url;
            // go to website
            await this.page.goto(this.url);

            // Set screen size
            await this.page.setViewport({ width: 1366, height: 768 });
            // authenticate user
            await this.authenticateUser(this.page)

            // wait for page to navigate to user information page
            await this.page.waitForNavigation()
            // wait for element to appear on screen
            await this.page.waitForSelector('[class="text-2xl font-semibold text-gray-800"]');
            // get customer information
            const customer: ICustomer = await this.getCustomerDetails(this.page)

            // get account information
            let accountInformation: IAccount[] = await this.getAccountInformation(this.page)

            // add transactions to account information
            accountInformation = await this.getTransactions(this.page, accountInformation)
            return { customer, accountInformation }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}