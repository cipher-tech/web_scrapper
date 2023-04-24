// Standard Customer format after formatting
export interface ICustomer {
    _id?: string;
    auth?: IAuth['_id']
    name: string
    address: string
    bvn: string
    phoneNumber: string
    email: string
}
export interface IAuth {
    _id?: string
    token: string,
    passCode: string,
    platform: string
    otp: number
}

export interface IAccount {
    customer: ICustomer["_id"]
    title: string
    accountBalance: number
    ledgerBalance: number
    currency: string
    symbol: string
    bank: string
    accountNumber?: string
    accountType: string
}

export interface ITransaction {
    type: string
    approvalDate: string
    description: string
    amount: number
    beneficiary: string
    sender: string
}
// general template to populate after scrapping for customer information
export interface ICustomerScrapTemplate {
    firstName: string,
    lastName: string,
    name: string,
    bvn: string,
    phoneNumber: string,
    email: string,
    address: string,
    apartmentNumber: string,
    street: string
    state: string,
    country: string
}
export interface IAccountScrapTemplate {
    accountName: string
    title: string
    accountBalance: string
    ledgerBalance: string
    currency: string
    symbol: string
    bank: string
    accountNumber?: string
    accountType: string
}
