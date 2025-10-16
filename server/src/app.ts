import express from 'express';
import cors from 'cors';
import logger from './utils/logger';
import { Request, Response, NextFunction } from 'express';
import healthRouter from './routes/health.route';
import collabRouter from './routes/collab.route';

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Request logger middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check route
app.use('/', healthRouter);
app.use('/collab', collabRouter);
// ❌ Error handler (always last)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;
