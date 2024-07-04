import express from "express";
import * as recommendationController from "../controllers/recommendationController.js";

const router = express.Router();

router.post(
  "/create_recommendation",
  recommendationController.createRecommendation
);

router.get(
  "/get_all_recommendations",
  recommendationController.getAllRecommendations
);

router.get(
  "/get_recommendation_by_categoryID/:categoryId",
  recommendationController.getRecommendationsByCategoryId
);

router.get(
  "/get_recommendations_by_userId/:userId",
  recommendationController.getRecommendationsByUserId
);

router.put(
  "/update_recommendation/:id",
  recommendationController.updateRecommendation
);

router.delete(
  "/delete_recommendation/:id",
  recommendationController.deleteRecommendation
);

export default router;
