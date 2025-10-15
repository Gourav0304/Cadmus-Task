import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

export class HealthController {
  static handleHealthController = (req: Request, res: Response) => {
    HealthService.handleHealthService(req, res);
  };
}
