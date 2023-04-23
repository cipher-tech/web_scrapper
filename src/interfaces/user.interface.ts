export interface ICustomer {
    name: string
    address: string
    bvn: string
    phone_no: string
    email: string
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