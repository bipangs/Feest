import { Request, Response, Router } from 'express';
const router = Router();
router.get('/', (_req: Request, res: Response) => { res.json({ message: 'Achievement routes' }); });
export default router;
