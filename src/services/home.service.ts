import { StatusAccessor } from "../dataAccess/status.accessor";
import { UserAccessor } from "../dataAccess/user.accessor";
import { WorkerAccessor } from "../dataAccess/worker.accessor";

export class HomeService {
  constructor(
    private userAccessor: UserAccessor,
    private workerAccessor: WorkerAccessor,
    private statusAccessor: StatusAccessor
  ) {}

  async getHomeData(userId: number) {
    const currentUser = await this.userAccessor.findByIdAndStatus(userId);
    // TODO : This should be cached
    const statuses = await this.statusAccessor.getAllStatuses();
    return {
      currentUser,
      statuses,
    };
  }
  async getWorkersData(
    userId: number,
    filter: { name?: string; statuses?: number[]; page: number }
  ) {
    const workers = await this.workerAccessor.getFilteredWorkers({
      ...filter,
      currentUserId: userId,
    });
    return workers;
  }

  async updateUserStatus(userId: number, statusId: number) {
    await this.userAccessor.updateUserStatus(userId, statusId);
  }
}
