import { prisma } from "../db/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../utils/jwt";
import crypto from "crypto";

export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });

  return user;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const decoded: any = verifyRefreshToken(refreshToken);

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revoked: false,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    id: decoded.id,
  });

  return newAccessToken;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Invalid credentials");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
    },
  });

  return { accessToken, refreshToken };
};

export const logoutUser = async (refreshToken: string) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
};