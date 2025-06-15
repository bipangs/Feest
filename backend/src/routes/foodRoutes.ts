import { Router } from 'express';
import { FoodController } from '../controllers/foodController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const foodController = new FoodController();

// Public routes
router.get('/', foodController.getAllFoods);
router.get('/:id', foodController.getFoodById);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/', upload.array('images', 5), foodController.createFood);
router.put('/:id', upload.array('images', 5), foodController.updateFood);
router.delete('/:id', foodController.deleteFood);
router.get('/my-foods', foodController.getFoodsByUser);
router.post('/:id/reserve', foodController.reserveFood);
router.post('/:id/unreserve', foodController.unreserveFood);

export default router;
