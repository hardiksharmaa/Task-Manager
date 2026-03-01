import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { refreshAccessToken, logoutUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const user = await registerUser(email, password, name);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } =
      await loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ error: "No refresh token" });
    }

    const newAccessToken = await refreshAccessToken(token);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err: any) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await logoutUser(token);
    }

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logged out successfully" });
  } catch {
    res.status(500).json({ error: "Logout failed" });
  }
};