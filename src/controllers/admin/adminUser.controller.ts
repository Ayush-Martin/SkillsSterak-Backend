import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../interfaces/services/IUser.service";
import { StatusCodes } from "../../utils/statusCodes";
import { successResponse } from "../../utils/responseCreators";

class AdminUserController {
  constructor(private userService: IUserService) {}

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page } = req.query as { search: string; page: string };

      const { users, currentPage, totalPages } =
        await this.userService.getUsers(search || "", Number(page) || 1);

      res
        .status(StatusCodes.OK)
        .json(
          successResponse("Users found", { users, currentPage, totalPages })
        );
    } catch (err) {
      next(err);
    }
  }

  public async blockUnblockUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const blockStatus = await this.userService.blockUnblockUser(userId);
      res.status(StatusCodes.OK).json(
        successResponse(`user is ${blockStatus ? "blocked" : "unblocked"}`, {
          userId,
          blockStatus,
        })
      );
    } catch (err) {
      next(err);
    }
  }
}

export default AdminUserController;
