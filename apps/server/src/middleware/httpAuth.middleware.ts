import { Request, Response, NextFunction } from "express";
import { decryptToken } from "../utils/authhelper";
import { AuthenticatedRequest } from "../types";

export const httpAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies) {
      token =
        req.cookies["authjs.session-token"] ||
        req.cookies["__Secure-authjs.session-token"];
    }

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const payload = await decryptToken(token, true);
    if (!payload?.sub) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    (req as AuthenticatedRequest).userId = payload.sub;
    next();
  } catch (err) {
    console.error("HTTP auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
