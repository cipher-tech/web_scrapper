import bcrypt from "bcrypt";
import config from "../config";

/**
* Utility class the with methods to manage text hashing.
*/
class HashText {
    /**
    * Static method that generates and returns a hashed text
    * @param {string} text text to hashed.
    * @returns {Promise<text>} hashed text
    */
    static async getHash(text: string) {
        try {
            const salt = Number(config?.SALT_ROUNDS);
            const hashedTest = await bcrypt.hash(text, salt);

            return hashedTest;
        } catch (error) {
            throw new Error("An error occurred please try again or contact support.");
        }
    }

    /**
    * Verify token and return token doc (or throw an error if it is not valid)
    * @param {string} text text to compare with hash
    * @param {string} hashedText hashed text
    * @returns {Promise<boolean>}
    */
    static async verifyHash(text:string, hashedText: string) {
        try {
            const isTextAMatch = await bcrypt.compare(text, hashedText);

            return isTextAMatch;
        } catch (error) {
            throw new Error("Could not hash test.");
        }
    }
}

export default HashText;
