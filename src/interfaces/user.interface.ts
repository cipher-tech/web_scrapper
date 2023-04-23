export interface ICustomer {
    name: string
    address: string
    bvn: string
    phone_no: string
    email: string
}

export interface IAccount {
    title: string
    amount: number
    balance: number
    transactions: ITransaction[]
}

export interface ITransaction {
    type: string
    date: string
    description: string
    amount: number
    beneficiary: string
    sender: string
}