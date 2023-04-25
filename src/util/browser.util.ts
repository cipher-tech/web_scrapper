import puppeteer, { Browser, Page } from 'puppeteer';
import config from '../config';

export abstract class BrowserInstance{
    browser: Browser
    page: Page
    url: string

    protected async createBrowser() {
        try { 
            this.browser = await puppeteer.launch({
                executablePath: config?.PUPPETEER_EXECUTABLE_PATH,
                headless: true,
                args: [ "--no-sandbox", "--disabled-setupid-sandbox", "--single-process", "--no-zygote" ],
            });
            this.page = await this.browser.newPage();
        } catch (error) {
            console.log(error);
            throw "Could not initialize browser"
        }
    }
}