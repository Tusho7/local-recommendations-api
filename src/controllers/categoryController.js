import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "კატეგორიის სახელი აუცილებელია." });
  }

  try {
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "სერვერზე შეცდომა" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "სერვერზე შეცდომა" });
  }
};

export const deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "კატეგორია ვერ მოიძებნა" });
    }

    await category.destroy();
    res.status(200).json({ message: "კატეგორია წაიშლა" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "სერვერზე შეცდომა" });
  }
};

export const updateCategoryNameById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "კატეგორიის სახელი აუცილებელია." });
  }

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "კატეგორია ვერ მოიძებნა" });
    }

    category.name = name;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category name:", error);
    res.status(500).json({ message: "სერვერზე შეცდომა" });
  }
};

export const totalCategories = async (req, res) => {
  try {
    const totalCategories = await Category.count();
    res.status(200).json({ totalCategories });
  } catch (error) {
    console.error("Error getting total categories:", error);
    res.status(500).json({ message: "სერვერზე შეცდომა" });
  }
};
