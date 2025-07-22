"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.User, { foreignKey: "UserId" });
      Favorite.belongsTo(models.Movie, { foreignKey: "MovieId" });
    }
  }
  Favorite.init(
    {
      notes: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      UserId: DataTypes.INTEGER,
      MovieId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
