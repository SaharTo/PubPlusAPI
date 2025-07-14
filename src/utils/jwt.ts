import jwt from "jsonwebtoken";

export const generateToken = (userId: number) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ userId }, secret, { expiresIn: "24h" });
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return jwt.verify(token, secret);
};
