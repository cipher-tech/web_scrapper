import  express from 'express'
import { BankScrapperController } from '../controllers';
import { authMiddleware } from '../middleware/auth.middleware';


const router = express.Router();

const bankScrapper = new BankScrapperController()
router
  .route('/scrap_test_bank')
  .post(authMiddleware, bankScrapper.scrapBank)
  .get(authMiddleware, bankScrapper.scrapBank);

export default router;