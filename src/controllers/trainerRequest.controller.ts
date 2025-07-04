import { Request, Response, NextFunction } from "express";
import { ITrainerService } from "../interfaces/services/ITrainer.service";
import { StatusCodes } from "../constants/statusCodes";
import { successResponse } from "../utils/responseCreators";
import { approveRejectRequestValidator } from "../validators/trainerRequest.validator";
import binder from "../utils/binder";
import { pageValidator } from "../validators/pagination.validator";
import { INotificationService } from "../interfaces/services/INotification.service";
import {
  GeneralMessage,
  TrainerRequestMessage,
} from "../constants/responseMessages";

/**
 * Handles trainer request approvals and queries, supporting admin workflows and notifications.
 * All methods are bound for safe Express routing.
 */
class TrainerRequestController {
  constructor(
    private trainerService: ITrainerService,
    private notificationService: INotificationService
  ) {
    // Ensures 'this' context is preserved for all methods
    binder(this);
  }

  /**
   * Retrieves all trainer requests with pagination, supporting admin review and approval flows.
   */
  public async getTrainerRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, size } = pageValidator(req.query);

      const { users, currentPage, totalPages } =
        await this.trainerService.getTrainerRequest(page, size);

      res.status(StatusCodes.OK).json(
        successResponse(GeneralMessage.DataReturned, {
          users,
          currentPage,
          totalPages,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Approves or rejects a trainer request and sends the appropriate notification.
   * Used for admin moderation of trainer applications.
   */
  public async approveRejectRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { status } = approveRejectRequestValidator(req.query);

    const { userId } = req.params;

    await this.trainerService.approveRejectTrainerRequest(userId, status);

    status == "approved"
      ? this.notificationService.sendApproveTrainerRequestNotification(userId)
      : this.notificationService.sendRejectTrainerRequestNotification(userId);

    res
      .status(StatusCodes.OK)
      .json(
        successResponse(
          status == "approved"
            ? TrainerRequestMessage.RequestApproved
            : TrainerRequestMessage.RequestRejected,
          { userId, status }
        )
      );
  }
}

export default TrainerRequestController;
