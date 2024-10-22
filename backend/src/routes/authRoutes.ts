import { Router } from "express";
import { check } from "express-validator";
import { register, login } from "../controllers/AuthController";

const router = Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
    check("role", "Role must be either Admin or Team Member").isIn([
      "Admin",
      "Team Member",
    ]),
  ],
  register
);

router.post("/login", login);

export default router;