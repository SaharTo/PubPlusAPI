import { db } from "../config/db";

interface User {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  isActive: boolean;
}

interface CreateUserInput {
  userName: string;
  firstName?: string;
  lastName?: string;
  hashedPassword: string;
}

export class UserAccessor {
  async findByUserName(userName: string): Promise<User | null> {
    try {
      const [rows] = await db.query("SELECT * FROM Users WHERE userName = ?", [
        userName,
      ]);
      const results = rows as User[];
      return results[0] || null;
    } catch (error) {
      console.error("Error in findByUserName:", error);
      throw error; // or handle it differently if you want
    }
  }

  async findById(userId: number): Promise<User | null> {
    const [rows] = await db.query(
      "SELECT * FROM Users WHERE userId = ? inner",
      [userId]
    );
    const results = rows as User[];
    return results[0] || null;
  }

  async findByIdAndStatus(
    userId: number
  ): Promise<(User & { statusId: number; statusName: string }) | null> {
    const [rows] = await db.query(
      `
    SELECT 
      u.*,
      w.statusId,
      s.statusName
    FROM Users u
    INNER JOIN Workers w ON u.userId = w.workerId
    INNER JOIN JobStatuses s ON w.statusId = s.statusId
    WHERE u.userId = ?
    `,
      [userId]
    );

    const results = rows as (User & { statusId: number; statusName: string })[];
    return results[0] || null;
  }

  async updateUserStatus(userId: number, statusId: number): Promise<void> {
    await db.query(
      "UPDATE Workers SET statusId = ?, lastUpdated = CURRENT_TIMESTAMP WHERE workerId = ?",
      [statusId, userId]
    );
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const [result] = await db.query(
      `
      INSERT INTO Users (userName, firstName, lastName, hashedPassword, isActive)
      VALUES (?, ?, ?, ?, true)
      `,
      [
        input.userName,
        input.firstName || null,
        input.lastName || null,
        input.hashedPassword,
      ]
    );

    const insertId = (result as any).insertId;

    // Insert default status into Workers table (statusId = 1)
    await db.query("INSERT INTO Workers (workerId, statusId) VALUES (?, ?)", [
      insertId,
      1,
    ]);

    return {
      userId: insertId,
      userName: input.userName,
      firstName: input.firstName || "",
      lastName: input.lastName || "",
      hashedPassword: input.hashedPassword,
      isActive: true,
    };
  }
}
