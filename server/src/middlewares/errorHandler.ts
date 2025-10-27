import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }

  res.status(500).json({ error: 'Unknown error occurred' });
}
