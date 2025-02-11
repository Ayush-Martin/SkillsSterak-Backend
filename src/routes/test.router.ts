import { Router } from "express";

const router = Router();

//controller
import TestController from "../controllers/test.controller";
const testController = new TestController();

router.get("/", testController.test);

export default router;
