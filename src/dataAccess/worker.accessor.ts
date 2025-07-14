import { db } from "../config/db";

interface Worker {
  workerId: number;
  statusId: number;
  lastUpdated: string;
  statusName: string;
  userName: string;
  firstName: string;
  lastName: string;
}

interface FilterOptions {
  name?: string;
  statuses?: number[];
  page: number;
}

export class WorkerAccessor {
  async getFilteredWorkers({
    name,
    statuses,
    page,
    currentUserId,
  }: FilterOptions & { currentUserId: number }): Promise<Worker[]> {
    const limit = 10;
    const offset = (page - 1) * limit;

    // Exclude current user from list of workers
    const conditions: string[] = [`u.userId != ?`];
    const params: any[] = [currentUserId];

    if (name) {
      conditions.push(
        `(u.firstName LIKE ? OR u.lastName LIKE ? OR u.userName LIKE ?)`
      );
      params.push(`%${name}%`, `%${name}%`, `%${name}%`);
    }

    if (statuses && statuses.length > 0) {
      const placeholders = statuses.map(() => "?").join(",");
      conditions.push(`w.statusId IN (${placeholders})`);
      params.push(...statuses);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
    SELECT 
      w.workerId, w.statusId, w.lastUpdated,
      s.statusName,
      u.userName, u.firstName, u.lastName
    FROM Workers w
    INNER JOIN JobStatuses s ON w.statusId = s.statusId
    INNER JOIN Users u ON w.workerId = u.userId
    ${whereClause}
    ORDER BY w.lastUpdated DESC
    LIMIT ? OFFSET ?
  `;

    params.push(limit, offset);

    const [rows] = await db.query(query, params);
    return rows as Worker[];
  }
}
