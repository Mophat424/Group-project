// AuthController.test.ts
import { register, login, authMiddleware, adminMiddleware } from './AuthController';
import { Request, Response, NextFunction } from 'express';
import { getXataClient } from "../xata";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../xata");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockRequest = (body: any) => ({ body } as Request);
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = () => jest.fn() as NextFunction;

describe("AuthController", () => {
  const xata = getXataClient();
  
  describe("register", () => {
    it("should register a user and return a JWT token", async () => {
      const req = mockRequest({ name: "John", email: "john@example.com", password: "password", role: "User" });
      const res = mockResponse();
      const next = mockNext();

      jest.spyOn(xata.db.User, "filter").mockResolvedValueOnce(null); // No existing user
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");
      jest.spyOn(xata.db.User, "create").mockResolvedValueOnce({ id: "1", role: "User" });
      jest.spyOn(jwt, "sign").mockReturnValue("token");

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should return an error if the user already exists", async () => {
      const req = mockRequest({ email: "john@example.com" });
      const res = mockResponse();
      const next = mockNext();

      jest.spyOn(xata.db.User, "filter").mockResolvedValueOnce({}); // User exists

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });
  });

  describe("login", () => {
    it("should log in a user and return a JWT token", async () => {
      const req = mockRequest({ email: "john@example.com", password: "password" });
      const res = mockResponse();
      const next = mockNext();

      jest.spyOn(xata.db.User, "filter").mockResolvedValueOnce({ password: "hashedPassword", id: "1", role: "User" });
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
      jest.spyOn(jwt, "sign").mockReturnValue("token");

      await login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should return an error for invalid credentials", async () => {
      const req = mockRequest({ email: "wrong@example.com", password: "password" });
      const res = mockResponse();
      const next = mockNext();

      jest.spyOn(xata.db.User, "filter").mockResolvedValueOnce(null); // User not found

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
  });

  describe("authMiddleware", () => {
    it("should call next if token is valid", () => {
      const req = mockRequest({});
      req.header = jest.fn().mockReturnValue("Bearer validtoken");
      const res = mockResponse();
      const next = mockNext();

      jest.spyOn(jwt, "verify").mockReturnValue({ id: "1", role: "User" });

      authMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if token is missing", () => {
      const req = mockRequest({});
      const res = mockResponse();
      const next = mockNext();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "No token, authorization denied" });
    });
  });

  describe("adminMiddleware", () => {
    it("should call next if user is an admin", () => {
      const req = mockRequest({});
      (req as any).user = { role: "Admin" };
      const res = mockResponse();
      const next = mockNext();

      adminMiddleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if user is not an admin", () => {
      const req = mockRequest({});
      (req as any).user = { role: "User" };
      const res = mockResponse();
      const next = mockNext();

      adminMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Admin access only" });
    });
  });
});
