import { Request, Response } from 'express';
import { CollabService } from '../services/collab.service';

export class CollabController {
  static async getSteps(req: Request, res: Response) {
    const { id } = req.params;
    const version = Number(req.query.version || 0);

    try {
      const data = await CollabService.getSteps(id, version);
      res.json(data);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  static async postSteps(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await CollabService.postSteps(id, req.body);

      if (result.conflict) {
        return res.status(409).json({
          error: 'Version conflict',
          steps: result.steps,
          clientIDs: result.clientIDs,
          version: result.version,
        });
      }

      res.json({ version: result.version });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  static async resetDocument(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await CollabService.resetDocument(id);
      res.json(result);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
}
