import express, { Request, Response } from 'express';

const router = express.Router();

interface StepEntry {
  steps: any[];
  clientIDs: (string | number)[];
  version: number;
}

const docs: Record<string, StepEntry> = {};

// 🟩 Fetch steps newer than a given version
router.get('/:id/steps', (req: Request, res: Response) => {
  const { id } = req.params;
  const version = Number(req.query.version || 0);

  const doc = docs[id] || { steps: [], clientIDs: [], version: 0 };
  if (!docs[id]) docs[id] = doc;

  const steps = doc.steps.slice(version);
  const clientIDs = doc.clientIDs.slice(version);
  res.json({ steps, clientIDs, version: doc.version });
});

// 🟦 Add new steps
router.post('/:id/steps', (req: Request, res: Response) => {
  const { id } = req.params;
  const { version, steps, clientID, clientIDs } = req.body;

  const doc = docs[id] || { steps: [], clientIDs: [], version: 0 };
  if (!docs[id]) docs[id] = doc;

  if (version !== doc.version) {
    return res.status(409).json({ error: 'Version conflict' });
  }

  doc.steps.push(...steps);
  doc.clientIDs.push(...(clientIDs || steps.map(() => clientID)));
  doc.version += steps.length;

  res.json({ version: doc.version });
});

export default router;
