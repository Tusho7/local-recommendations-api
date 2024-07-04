import Category from "../models/Category.js";
import Recommendation from "../models/Recommendation.js";
import User from "../models/User.js";

export const createRecommendation = async (req, res) => {
  const { name, review, address, phoneNumber, website, categoryId, userId } =
    req.body;

  if (!name || !review) {
    return res
      .status(400)
      .json({ message: "ობიექტის სახელი და შეფასება აუცილებელია." });
  }

  if (!categoryId) {
    return res.status(400).json({ message: "კატეგორია აუცილებელია." });
  }

  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "კატეგორია ვერ მოიძებნა." });
    }

    const newRecommendation = await Recommendation.create({
      name,
      review,
      address,
      phoneNumber,
      website,
      categoryId,
      userId,
    });

    res.status(201).send(newRecommendation);
  } catch (error) {
    console.error("Error creating recommendation: ", error);
    res.status(500).json({ message: "დაფიქსირდა შცდომა." });
  }
};

export const getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    res.status(200).send(recommendations);
  } catch (error) {
    console.error("Error getting recommendations: ", error);
    res.status(500).json({ message: "დაფიქსირდა შცდომა." });
  }
};

export const getRecommendationsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).send("კატეგორია აუცილებელია.");
  }

  try {
    const recommendations = await Recommendation.findAll({
      where: { categoryId },
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["firstName", "lastName"],
        }
      ]
    });

    if (recommendations.length === 0) {
      return res.json({
        message: "ამ კატეგორიაში არ მოიძებნა რეკომენდაციები.",
      });
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error getting recommendations by category ID: ", error);
    res.status(500).json({ message: "დაფიქსირდა შეცდომა." });
  }
};

export const getRecommendationsByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "მომხმარებლის ID ვერ მოიძებნა." });
  }

  try {
    const recommendations = await Recommendation.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (recommendations.length === 0) {
      return res
        .status(404)
        .json({ message: "თქვენ არ გაქვთ რეკომენდაციები დამატებული." });
    }

    res.status(200).send(recommendations);
  } catch (error) {
    console.error("Error getting recommendations by user ID:", error);
    res.status(500).json({ message: "დაფიქსირდა შეცდომა." });
  }
};

export const updateRecommendation = async (req, res) => {
  const { id } = req.params;
  const { name, review, address, phoneNumber, website, categoryId } = req.body;

  if (!id) {
    return res.status(400).json({ message: "რეკომენდაციის ID ვერ მოიძებნა." });
  }

  try {
    const recommendation = await Recommendation.findByPk(id);

    if (!recommendation) {
      return res.status(404).json({ message: "რეკომენდაცია ვერ მოიძებნა." });
    }

    if (recommendation.userId !== req.user.id) {
      return res.status(403).json({
        message: "თქვენ არ გაქვთ ამ რეკომენდაციის განახლების უფლება.",
      });
    }

    recommendation.name = name || recommendation.name;
    recommendation.review = review || recommendation.review;
    recommendation.address = address || recommendation.address;
    recommendation.phoneNumber = phoneNumber || recommendation.phoneNumber;
    recommendation.website = website || recommendation.website;
    recommendation.categoryId = categoryId || recommendation.categoryId;

    await recommendation.save();

    res.status(200).json(recommendation);
  } catch (error) {
    console.error("Error updating recommendation:", error);
    res
      .status(500)
      .json({ message: "დაფისქირდა შეცდომა რეკომენდაციის განახლებისას." });
  }
};

export const deleteRecommendation = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "რეკომენდაციის ID ვერ მოიძებნა." });
  }

  try {
    const recommendation = await Recommendation.findByPk(id);

    if (!recommendation) {
      return res.status(404).json({ message: "რეკომენდაცია ვერ მოიძებნა." });
    }

    if (recommendation.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "თქვენ არ გაქვთ ამ რეკომენდაციის წაშლის უფლება." });
    }

    await recommendation.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    res
      .status(500)
      .json({ message: "დაფიქსირდა შეცდომა რეკომენდაციის წაშლისას." });
  }
};
