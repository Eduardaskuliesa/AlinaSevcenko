import { createCategory } from "./create";
import { deleteCategory } from "./deleteCategory";
import { getAllCategoriesUP } from "./getAllCategoriesUP";
import { getCategories } from "./getCategories";
import { updateCategory } from "./updateCatogery";

export const categoryActions = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getAllCategoriesUP,
};
