import { Logger } from "winston";

// make logger global so we don't need to import it in every file
declare global {
    namespace globalThis {
        let logger: Logger
    }
}
