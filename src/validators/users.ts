import { NextFunction, Request, Response } from "express";

export function validateCreateUser(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  next();
}

export function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }
  if (!password) {
    return res.status(400).json({ error: "Missing password" });
  }

  next();
}

export function validateLoginUser(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  next();
}
