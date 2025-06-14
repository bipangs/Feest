import { Request, Response, Router } from 'express';
const router = Router();
router.get('/', (_req: Request, res: Response) => { res.json({ message: 'Message routes' }); });
export default router;
