// Standard Customer format after formatting
export interface ICustomer {
    name: string
    address: string
    bvn: string
    phoneNumber: string
    email: string
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
export interface IAuth {
    token: string,
    passCode: string,
    platform: string
    otp: number
}

export interface IAccount {
    title: string
    amount: number
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