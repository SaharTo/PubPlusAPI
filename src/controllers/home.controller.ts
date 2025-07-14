import { Response } from "express";
import { HomeService } from "../services/home.service";
import { UserAccessor } from "../dataAccess/user.accessor";
import { WorkerAccessor } from "../dataAccess/worker.accessor";
import { StatusAccessor } from "../dataAccess/status.accessor";

const homeService = new HomeService(
  new UserAccessor(),
  new WorkerAccessor(),
  new StatusAccessor()
);

export const getHomeData = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const result = await homeService.getHomeData(userId);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const getWorkersData = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, statuses, page = 1 } = req.query;
    const result = await homeService.getWorkersData(userId, {
      name: name?.toString(),
      statuses: statuses
        ? (statuses as string).split(",").map(Number)
        : undefined,
      page: Number(page),
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateStatus = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { statusId } = req.body;
    await homeService.updateUserStatus(userId, statusId);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
