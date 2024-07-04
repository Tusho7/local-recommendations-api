import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Category from "./Category.js";
import User from "./User.js";

const Recommendation = sequelize.define(
  "Recommendation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "recommendations",
    timestamps: false,
  }
);

Recommendation.belongsTo(Category, { foreignKey: "categoryId" });
Recommendation.belongsTo(User, { foreignKey: "userId" });
export default Recommendation;
