import { db } from "../config/db";

interface Status {
  statusId: number;
  statusName: string;
}

export class StatusAccessor {
  async getAllStatuses(): Promise<Status[]> {
    const [rows] = await db.query(
      "SELECT statusId, statusName FROM JobStatuses where isActive = 1"
    );
    const results = rows as Status[];
    return results;
  }
}
