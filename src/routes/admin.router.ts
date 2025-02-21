import { Router } from "express";

const router = Router();

//models
import UserModel from "../models/User.model";

//repositories
import UserRepository from "../repositories/user.repository";

//services
import UserService from "../services/user.service";

//controllers
import AdminUserController from "../controllers/admin/adminUser.controller";

//middlewares
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware";

const userRepository = new UserRepository(UserModel);
const userService = new UserService(userRepository);
const adminUserController = new AdminUserController(userService);

router.use(adminAuthMiddleware);

router
  .route("/users")
  .get(adminUserController.getUsers.bind(adminUserController));

router
  .route("/users/:userId")
  .patch(adminUserController.blockUnblockUser.bind(adminUserController));

export default router;
