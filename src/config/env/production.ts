// import env config keys for production
const development = {
    MONGODB_URL: process.env.MONGODB_URL,
    ENVIRONMENT: "production",
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    OTP: process.env.OTP
};

export default development;
