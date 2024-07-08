import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import Category from "../models/Category.js";

const router = express.Router();

router.post("/create_category", categoryController.createCategory);
router.get("/get_categories", categoryController.getAllCategories);
router.delete("/delete_category/:id", categoryController.deleteCategoryById);

router.get("/get_category_name/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id); 
  
      if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
      }
  
      const category = await Category.findByPk(categoryId);
  
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      res.json({ category: { id: category.id, name: category.name } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get("/total_categories", categoryController.totalCategories)

export default router;