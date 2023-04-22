// import env config keys for development
const development = {
    MONGODB_URL: process.env.MONGODB_URL,
    ENVIRONMENT: "development",
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
    OTP: process.env.OTP
};

export default development;
