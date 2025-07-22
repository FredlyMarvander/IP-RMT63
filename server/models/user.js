"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Name is required",
          },
          notEmpty: {
            args: true,
            msg: "Name is required",
          },
        },
      },
      profilePict: {
        type: DataTypes.STRING,
        defaultValue:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fdefault-user&psig=AOvVaw0xQTae1njWOBwGCKMMHB4f&ust=1753262434769000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOiLkdiR0I4DFQAAAAAdAAAAABAE",
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: "Email must be unique",
        },
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Email is required",
          },
          notEmpty: {
            args: true,
            msg: "Email is required",
          },
          isEmail: {
            args: true,
            msg: "Must be a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Password is required",
          },
          notEmpty: {
            args: true,
            msg: "Password is required",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(User) {
          User.password = hashPassword(User.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
