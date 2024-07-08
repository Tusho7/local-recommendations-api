import express from "express";
import * as recommendationController from "../controllers/recommendationController.js";
import { middleware } from "../middlewares/auth.js";

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
  "/update_recommendation/:id", middleware,
  recommendationController.updateRecommendation
);

router.delete(
  "/delete_recommendation/:id", middleware,
  recommendationController.deleteRecommendation
);

router.get("/total_recommendations", recommendationController.totalRecommendations)

export default router;
