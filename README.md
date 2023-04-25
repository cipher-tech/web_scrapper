
## Table of Contents

- [Description](#description)
- [Run Locally](#run-Locally)
- [Features](#features)
- [Documentation](#documentation)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-Stack)


# Description 

### live URL: https://web-scrapper-test.onrender.com/api/scrap_test_bank
POST: `https://web-scrapper-test.onrender.com/api/scrap_test_bank`
```
{
  "token": "Your email",
  "passCode": "Your password"
}
```

GET: `https://web-scrapper-test.onrender.com/api/scrap_test_bank`

This is an app that help's a user to manage pricing schemes. 
It allows users to enter product and rules(special offers) that apply to those products. It is built like an online store so users can: 

* Add a product to the basket(cart)
* Remove a product from the basket(cart)
* See the calculated price in real time
* Visualize the set of rules(special offers)
* Add new rules (edit discounts, add new products), And
* Remove rules
 


## Run Locally

Clone the project

```bash
  git clone https://github.com/cipher-tech/web_scrapper
```

Go to the project directory

```bash
  cd web_scrapper
```

Install dependencies

```bash
  npm install
```


Start the development server

```bash
  npm run dev
```

Open [http://localhost:4000/api/scrap_test_bank](http://localhost:4000) 
with your browser to see the result.

you can send a get request with no request body to test with the default values or you can send a post request too the same route with a body with keys

```
{
  "token": "Your email",
  "passCode": "Your password"
}
```
## Features

- **Typescript support**
- **Docker support**
- **MVC patten**
- **Fast**
- **Object oriented approach**
- **MongoDB integration**
- **Database models**
- **Error Handling**


## Documentation

[Documentation](https://bankof.okra.ng)

## Project Structure
This project uses a backend script to scrape a test website `https://bankof.okra.ng`. It makes use of puppeteer package to programmatically get information from the website. It runs a headless Chromium browser and loads the website before scraping the website for information. 

It Illustrates a scenario where a where a financial institution gets `Authentication` records of various `Customers` in various `Accounts` with the various `Transactions` linked to the `Customer` `Account`.

It is hosted on a serverless infrastructure using a docker container.

The project has four main entities. 
1. `auth`
2. `customer`
3. `account`
4. `transaction`entity

The entities have a corresponding MongoDB database collection where the data for each entity is stored. The entities are related to one another using a primary key.

## Relationships

A `Customer` can have many `Auth` records in the `Auth` table for different banks while am Auth and only have one user hence there's a `Many-To-One` relationship between  Customer and Auth entities.

 `Customer`  and `Account` entity also share a `Many-To-One` relationship

Account entity can have many `Transactions` but a transaction can only belong to one `Account`. This forms a `Many-To-One` relationship as well.

many `transaction` are related to one Customer via an `Account` 
this forms a `Has-many-through` relationship between a `Customer` and `Transactions`.

`Auth` - `Customer`  (many-to-one)
`Transactions` - `Account` (many-to-one)
`Account` - `Customer` (many-to-one)
`Customer` - `Transactions` (has-many-through)

in this manner it is easy to query for entities and also populate data no more than one level deep. 

## Model Structure
```
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

```


Due to the fact that the application is built to support many banks the scrapped data has to be formatted to a general standard by a formatter service which is built into the app.
## Tech Stack

**Server:** puppeteer, Node, express Typescript, docker.

## Todo

Due too the time limit I could not add a test suit for the project.
I will add a test suite with Jest subsequently.


