import { Request, Response, NextFunction } from "express";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { StatusCodes } from "../utils/statusCodes";
import { successResponse } from "../utils/responseCreators";

class TrainerRequestController {
  constructor(private trainerService: ITrainerService) {}

  public async getTrainerRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page } = req.query as { search: string; page: string };

      const { users, currentPage, totalPages } =
        await this.trainerService.getTrainerRequest(Number(page) || 1);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse("Requests found", { users, currentPage, totalPages })
        );
    } catch (err) {
      next(err);
    }
  }

  public async approveRejectRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { status } = req.query as {
      status: "approved" | "rejected";
    };

    const { userId } = req.params;

    await this.trainerService.approveRejectTrainerRequest(userId, status);

    res
      .status(StatusCodes.OK)
      .json(successResponse(`Request has been ${status}`, { userId, status }));
  }
}

export default TrainerRequestController;
