const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const { User } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

module.exports = class UserController {
  static async googleLogin(req, res) {
    try {
      const { id_token } = req.body;
      console.log(id_token, "<<, ID Token");
      console.log(process.env.CLIENT_ID, "<<, Client ID");

      if (!id_token) {
        return res.status(400).json({ error: "Missing id_token in request" });
      }
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.CLIENT_ID,
      });

      const { name, email, picture } = ticket.getPayload();

      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: Math.random().toString(36).slice(-8),
          profilePicture: picture,
        });
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({
        access_token,
        name: user.name,
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUserProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password, profilePict } = req.body;
      const user = await User.create({ name, email, password, profilePict });

      res.status(201).json({
        name: name,
        profilePict: profilePict,
      });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Invalid email/password" });
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email/password" });
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({
        access_token,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
