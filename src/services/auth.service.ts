import bcrypt from "bcryptjs";
import { UserAccessor } from "../dataAccess/user.accessor";
import { generateToken } from "../utils/jwt";

interface RegisterInput {
  userName: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

export class AuthService {
  constructor(private userAccessor: UserAccessor) {}

  async login(userName: string, password: string) {
    const user = await this.userAccessor.findByUserName(userName);
    if (!user || !user.isActive) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user.userId);
    return {
      token,
      user: {
        userId: user.userId,
        userName: user.userName,
        firstName: user.firstName,
      },
    };
  }

  async register(input: RegisterInput) {
    const existing = await this.userAccessor.findByUserName(input.userName);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.userAccessor.createUser({
      userName: input.userName,
      firstName: input.firstName,
      lastName: input.lastName,
      hashedPassword,
    });

    return {
      userId: user.userId,
      userName: user.userName,
      firstName: user.firstName,
    };
  }
}
