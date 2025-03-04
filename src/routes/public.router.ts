import { Router } from "express";

const router = Router();

//models
import CategoryModel from "../models/Category.model";
import CourseModel from "../models/Course.model";

//repositories
import CategoryRepository from "../repositories/category.repository";
import CourseRepository from "../repositories/course.repository";

//services
import CategoryService from "../services/category.service";
import CourseService from "../services/course.service";

//controllers
import CategoryController from "../controllers/category.controller";
import CourseController from "../controllers/course.controller";

const categoryRepository = new CategoryRepository(CategoryModel);
const courseRepository = new CourseRepository(CourseModel);

const categoryService = new CategoryService(categoryRepository);
const courseService = new CourseService(courseRepository);

const categoryController = new CategoryController(categoryService);
const courseController = new CourseController(courseService);

router.get(
  "/categories",
  categoryController.getAllCategories.bind(categoryController)
);

// router.get("/courses")

router.get("/courses", courseController.getCourses.bind(courseController));

router
  .route("/courses/:courseId")
  .get(courseController.getCourse.bind(courseController));

export default router;
