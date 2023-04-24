import { ObjectId } from "mongoose";

// Standard Customer format after formatting
export interface ICustomer {
    _id?: ObjectId;
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
    _id?: ObjectId
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
    _id?: ObjectId
    transactionType: string
    account: IAccount["_id"],
    customer: ICustomer["_id"]
    approvalDate: string
    description: string
    amount: number
    destinationId: string
    senderId: string,
    status: string
    billerId: string
    tax: number
    totalPayment: number
    paymentMethod: string
    paymentMethodId: string
    eventId: string
    sourceBankId: string
    destinationBankId: string
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
