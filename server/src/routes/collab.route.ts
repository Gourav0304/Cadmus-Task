import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/:id/steps', async (req: Request, res: Response) => {
  const { id } = req.params;
  const version = Number(req.query.version || 0);

  let doc = await prisma.doc.findUnique({ where: { id } });
  if (!doc) {
    doc = await prisma.doc.create({
      data: { id, steps: [], clientIDs: [], version: 0 },
    });
  }

  const steps = doc.steps.slice(version);
  const clientIDs = doc.clientIDs.slice(version);
  res.json({ steps, clientIDs, version: doc.version });
});

router.post('/:id/steps', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { version, steps, clientID, clientIDs } = req.body;

  let doc = await prisma.doc.findUnique({ where: { id } });
  if (!doc) {
    doc = await prisma.doc.create({
      data: { id, steps: [], clientIDs: [], version: 0 },
    });
  }

  if (version !== doc.version) {
    const clientSteps = steps.map((s: any) => s);

    return res.status(409).json({
      error: 'Version conflict',
      steps: doc.steps,
      clientIDs: doc.clientIDs,
      version: doc.version,
    });
  }

  const newSteps = [...doc.steps, ...steps];
  const newClientIDs = [
    ...doc.clientIDs,
    ...(clientIDs || steps.map(() => clientID)),
  ];
  const newVersion = doc.version + steps.length;

  await prisma.doc.update({
    where: { id },
    data: { steps: newSteps, clientIDs: newClientIDs, version: newVersion },
  });

  res.json({ version: newVersion });
});

router.post('/:id/reset', async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.doc.upsert({
    where: { id },
    update: { steps: [], clientIDs: [], version: 0 },
    create: { id, steps: [], clientIDs: [], version: 0 },
  });

  res.json({ message: 'Document reset successfully.' });
});

export default router;
