import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CollabService {
  static async getSteps(docId: string, version: number) {
    let doc = await prisma.doc.findUnique({ where: { id: docId } });

    if (!doc) {
      doc = await prisma.doc.create({
        data: { id: docId, steps: [], clientIDs: [], version: 0 },
      });
    }

    const steps = doc.steps.slice(version);
    const clientIDs = doc.clientIDs.slice(version);

    return { steps, clientIDs, version: doc.version };
  }

  static async postSteps(docId: string, body: any) {
    const { version, steps, clientID, clientIDs } = body;

    let doc = await prisma.doc.findUnique({ where: { id: docId } });

    if (!doc) {
      doc = await prisma.doc.create({
        data: { id: docId, steps: [], clientIDs: [], version: 0 },
      });
    }

    if (version !== doc.version) {
      return {
        conflict: true,
        steps: doc.steps,
        clientIDs: doc.clientIDs,
        version: doc.version,
      };
    }

    const newSteps = [...doc.steps, ...steps];
    const newClientIDs = [
      ...doc.clientIDs,
      ...(clientIDs || steps.map(() => clientID)),
    ];
    const newVersion = doc.version + steps.length;

    await prisma.doc.update({
      where: { id: docId },
      data: { steps: newSteps, clientIDs: newClientIDs, version: newVersion },
    });

    return { conflict: false, version: newVersion };
  }

  static async resetDocument(docId: string) {
    await prisma.doc.upsert({
      where: { id: docId },
      update: { steps: [], clientIDs: [], version: 0 },
      create: { id: docId, steps: [], clientIDs: [], version: 0 },
    });

    return { message: 'Document reset successfully.' };
  }
}
