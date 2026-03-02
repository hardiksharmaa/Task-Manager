import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/appError";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      if (source === "body") {
        req.body = parsed;
      } else {
        (req as any).validated = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues.map(
          (e) => `${e.path.join(".")}: ${e.message}`
        );
        next(new AppError(messages.join(", "), 422));
        return;
      }
      next(err);
    }
  };
