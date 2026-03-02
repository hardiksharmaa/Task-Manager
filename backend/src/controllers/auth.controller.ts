import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { refreshAccessToken, logoutUser } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError } from "../utils/appError";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const user = await registerUser(email, password, name);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: { id: user.id, email: user.email },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ success: true, accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new UnauthorizedError("No refresh token");
  }

  const newAccessToken = await refreshAccessToken(token);

  res.status(200).json({ success: true, accessToken: newAccessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await logoutUser(token);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});