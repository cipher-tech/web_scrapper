import puppeteer, { Browser, Page } from 'puppeteer';
import config from '../../config';
import { IAccount, IAccountScrapTemplate, IAuth, ICustomer, ICustomerScrapTemplate, ITransaction } from '../../interfaces/user.interface';
import { getNumbers, replaceString } from '../../util/replace.string.util';
import { Formatter } from '../formatter/bank.formatter.service';
import { IScrapBankOptions } from '../../controllers/bank.scrapper.controller';
import CustomerModel from '../../models/customer.model';
import accountModel from '../../models/account.model';
import transactionModel from '../../models/transaction.model';

interface IBankOfOkraOptions extends IScrapBankOptions {
    auth: IAuth
}
type TransactionsProps = {
    page: Page,
    accounts: IAccount[],
    customer: ICustomer,
    options: IBankOfOkraOptions
}
type getAccountInformation = {
    page: Page,
    customer: ICustomer,
    bank: string
}
/**
 * Bank-of-okra scrapper service class
 * contains all methods and properties to scrap bank-Of-Okra.
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

    async authenticateUser(page: Page, options: IBankOfOkraOptions) {
        try {
            // click the login button
            await page.click('[href="/login"]')

            // fill out the form 
            // enter email
            await page.type('#email', options.token);
            // enter password
            await page.type('#password', (options.passCode));
            // submit form
            await page.click('[type="submit"]')

            // dismiss dialog
            await page.on('dialog', async dialog => {
                await dialog.dismiss();
            });

            // enter opt
            await this.page.waitForSelector("#otp");
            await this.page.type('#otp', `${ options.auth.otp }`);

            // click submit  
            await this.page.click('[type="submit"]')
            return true;
        } catch (error) {
            console.log(error);
            throw "Could not authenticate customer"
        }
    }

    async getCustomerDetails(page: Page, options: IBankOfOkraOptions) {
        try {
            let customer: Partial<ICustomerScrapTemplate> = {}
            // get customer name
            const customerName = await page.$$('[class="text-2xl font-semibold text-gray-800"]');

            for (let text of customerName) {
                customer.name = await page.evaluate(el => el.innerHTML, text) || ""
            }

            // get other customer information
            const customerInfo = await page.$$('div > [class="text-default my-3"]');

            customer.address = await page.evaluate(el => el.textContent, customerInfo[ 0 ]) || ''
            customer.bvn = await page.evaluate(el => el.textContent, customerInfo[ 1 ]) || ""
            customer.phoneNumber = await page.evaluate(el => el.textContent, customerInfo[ 2 ]) || ""
            customer.email = await page.evaluate(el => el.textContent, customerInfo[ 3 ]) || ""

            // format scrapped customer data
            const formatter = new Formatter()
            // remove unwanted text before sending to formatter
            return formatter.customerFormatter({
                name: replaceString((customer.name || ''), 'Welcome back', ''),
                address: replaceString(customer.address, 'Address:', ''),
                bvn: replaceString(customer.bvn, 'BVN:', ''),
                phoneNumber: replaceString(customer.phoneNumber, 'Phone:', ''),
                email: replaceString(customer.email, 'Email:', ''),
            }, options.auth)

        } catch (error) {
            console.log(error);
            throw "Could not get customer information"
        }
    }

    async getAccountInformation(option: getAccountInformation) {
        const { page, customer, bank } = option
        try {
            const account: Partial<IAccountScrapTemplate>[] = []

            const bankFormatter = new Formatter()
            // get user account information
            const accountInfo = await page.$$('section.rounded');

            // scrap  account information
            for (let acct of accountInfo) {
                const title = await page.evaluate(el => el.querySelector('div > h3')?.textContent, acct) || ""
                const accountBalance = (await page.evaluate(el => el.querySelector('div > p.font-bold')?.textContent, acct)) || ""
                const ledgerBalance = await page.evaluate(el => el.querySelector('p:nth-child(2)')?.textContent, acct) || ""

                console.log(":::::::::: ledgerBalance ledgerBalance",{accountBalance, ledgerBalance});

                account.push({
                    title,
                    accountBalance: accountBalance,
                    ledgerBalance: ledgerBalance,
                    bank,
                })
            }

            // pass  scrapped information to formatter and return result
            return bankFormatter.accountFormatter(account, customer)
        } catch (error) {
            console.log(error);
            throw "Could not retrieve account information."
        }
    }

    async getTransactions(options: TransactionsProps) {
        const { page, accounts, customer } = options
        try {
            // object to store different transactions
            const transactionArray: { [ key: string ]: ITransaction[] } = {}

            const accountButtonSelector = 'div > a[href^="/account"]'
            // get button link to each account transaction
            const accountButtons = await page.$$(accountButtonSelector);

            for (let i = 1; i <= accountButtons.length; i++) {
                // click link to display account transaction
                await page.waitForSelector('[class="flex-1 w-full"] a.rounded');

                await page.click(`section[class~="w-4/5"]:nth-child(${ i + 1 }) > ${ accountButtonSelector }`)
                // wait for transactions to appear
                await page.waitForSelector('tbody > tr');

                // get account name
                const accountType = await page.$eval('[class="w-full flex-1"] h3', el => el.textContent);
                const customerAccount = accounts.find(acct => acct.accountType === accountType)

                // create an object to store transactions for an account
                if (!accountType || !customerAccount?.accountType) {
                    throw "Could not get account name for transaction"
                }
                transactionArray[ accountType ] = []
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
                        let transactionType = await page.evaluate(el => el.querySelector('th:nth-child(1)')?.textContent, transaction) || ""
                        // get transaction date
                        let approvalDate = await page.evaluate(el => el.querySelector('td:nth-child(2)')?.textContent, transaction) || ""
                        // get transaction description
                        let description = await page.evaluate(el => el.querySelector('td:nth-child(3)')?.textContent, transaction) || ""
                        // get transaction amount
                        let amount = await page.evaluate(el => el.querySelector('td:nth-child(4)')?.textContent, transaction) || ""
                        // get transaction beneficiary
                        let destinationId = await page.evaluate(el => el.querySelector('td:nth-child(5)')?.textContent, transaction) || ""
                        // get transaction sender
                        let senderId = await page.evaluate(el => el.querySelector('td:nth-child(6)')?.textContent, transaction) || ""

                        console.log("::::::::::",amount);
                        
                        const formatter = new Formatter()
                        // format transactions before adding  to array to avoid looping twice
                        transactionArray[ accountType ].push(
                            formatter.transactionFormatter({
                                customer,
                                account: customerAccount,
                                transaction: {
                                    transactionType,
                                    approvalDate,
                                    description,
                                    amount: parseFloat(getNumbers(amount)),
                                    destinationId,
                                    senderId
                                }
                            })
                        )
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
            console.log(transactionArray);

            return transactionArray
        } catch (error) {
            console.log(error);
            throw "Could not get customer transactions"
        }
    }
    async run(options: IBankOfOkraOptions) {
        try {
            await this.createBrowser()
            this.url = options.url;
            // go to website
            await this.page.goto(this.url);

            // Set screen size
            await this.page.setViewport({ width: 1366, height: 768 });
            // authenticate user
            await this.authenticateUser(this.page, options)

            // wait for page to navigate to user information page
            await this.page.waitForNavigation()
            // wait for element to appear on screen
            await this.page.waitForSelector('[class="text-2xl font-semibold text-gray-800"]');
            // get customer information
            const formattedCustomerInfo: ICustomer = await this.getCustomerDetails(this.page, options)

            const customer = await CustomerModel.createCustomer(formattedCustomerInfo)
            // get account information
            let accountInformation: IAccount[] = await this.getAccountInformation({ page: this.page, customer, bank: options.bank })

            const accounts = await accountModel.createAccount(accountInformation)

            // add transactions to account information
            const transactionInformation = await this.getTransactions({ page: this.page, accounts, customer, options })

            // save transactions
            const transactions = await transactionModel.createTransaction(transactionInformation)
            console.log({ customer, accountInformation, accounts, transactionInformation, transactions });

            return { customer, accountInformation, transactions }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}