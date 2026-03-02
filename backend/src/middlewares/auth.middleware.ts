import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/appError";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError());
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};