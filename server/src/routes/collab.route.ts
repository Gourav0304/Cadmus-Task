import express from 'express';
import { CollabController } from '../controllers/collab.controller';

const router = express.Router();

router.get('/:id/steps', CollabController.getSteps);
router.post('/:id/steps', CollabController.postSteps);
router.post('/:id/reset', CollabController.resetDocument);

export default router;
