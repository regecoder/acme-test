import { Request, Response, NextFunction } from 'express';

export default function handleError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendError(err, res, next);
  reportError(err);
}

function reportError(err: Error): void {
  console.error(err.message);
}

function sendError(error: Error, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const httpCode = 500;

  res.status(httpCode).json({
    status: httpCode,
    message: error.message
  });
}
