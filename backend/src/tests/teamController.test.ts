// TeamController.test.ts
import { createTeam, updateTeam } from './TeamController';
import { Request, Response } from 'express';
import { getXataClient } from "../xata";

jest.mock("../xata");

const mockRequest = (body: any, params: any) => ({ body, params } as Request);
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("TeamController", () => {
  const xata = getXataClient();

  describe("createTeam", () => {
    it("should create a team and return it", async () => {
      const req = mockRequest({ name: "New Team" }, {});
      const res = mockResponse();

      jest.spyOn(xata.db.Team, "create").mockResolvedValueOnce({ id: "teamId", name: "New Team" });

      await createTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "teamId", name: "New Team" });
    });
  });

  describe("updateTeam", () => {
    it("should update a team and return it", async () => {
      const req = mockRequest({ name: "Updated Team" }, { teamId: "teamId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Team, "update").mockResolvedValueOnce({ id: "teamId", name: "Updated Team" });

      await updateTeam(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: "teamId", name: "Updated Team" });
    });

    it("should return an error if the team is not found", async () => {
      const req = mockRequest({}, { teamId: "teamId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Team, "update").mockResolvedValueOnce(null); // Team not found

      await updateTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Team not found" });
    });
  });
});
