import { Router } from "express";

const router = Router();

//models
import CategoryModel from "../models/Category.model";

//repositories
import CategoryRepository from "../repositories/category.repository";

//services
import CategoryService from "../services/category.service";

//controllers
import CategoryController from "../controllers/category.controller";

const categoryRepository = new CategoryRepository(CategoryModel);

const categoryService = new CategoryService(categoryRepository);

const categoryController = new CategoryController(categoryService);

router.get(
  "/categories",
  categoryController.getAllCategories.bind(categoryController)
);

export default router;
