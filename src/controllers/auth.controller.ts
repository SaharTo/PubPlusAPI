import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserAccessor } from "../dataAccess/user.accessor";

const authService = new AuthService(new UserAccessor());

export const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const result = await authService.login(userName, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, firstName, lastName, password } = req.body;
    const newUser = await authService.register({
      userName,
      firstName,
      lastName,
      password,
    });
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
