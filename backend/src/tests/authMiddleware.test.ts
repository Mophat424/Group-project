// tests/authMiddleware.test.ts
import { authMiddleware } from '../middlewares/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should deny access if no token is provided', () => {
    req.header = jest.fn().mockReturnValue(undefined);
    authMiddleware(req as Request, res as Response, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token, authorization denied" });
  });

  it('should deny access if token is invalid', () => {
    req.header = jest.fn().mockReturnValue('Bearer invalidtoken');
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token is invalid');
    });
    
    authMiddleware(req as Request, res as Response, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is not valid" });
  });

  it('should allow access if token is valid', () => {
    const userPayload = { id: '123', role: 'Admin' };
    req.header = jest.fn().mockReturnValue('Bearer validtoken');
    (jwt.verify as jest.Mock).mockReturnValue(userPayload);
    
    authMiddleware(req as Request, res as Response, next);
    
    expect(req.user).toEqual(userPayload);
    expect(next).toHaveBeenCalled();
  });
});
