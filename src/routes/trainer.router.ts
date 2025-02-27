import { Router } from "express";

const router = Router();

//models
import CourseModel from "../models/Course.model";

//repositories
import CourseRepository from "../repositories/course.repository";

//services
import CourseService from "../services/course.service";

//controllers
import CourseController from "../controllers/course.controller";

//middlewares
import { trainerAuthMiddleware } from "../middlewares/trainerAuth.middelware";
import upload from "../config/multer";

const courseRepository = new CourseRepository(CourseModel);

const courseService = new CourseService(courseRepository);

const courseController = new CourseController(courseService);

//setting middleware
router.use(trainerAuthMiddleware);

router
  .route("/courses")
  .post(
    upload.single("image"),
    courseController.createCourse.bind(courseController)
  );

export default router;
