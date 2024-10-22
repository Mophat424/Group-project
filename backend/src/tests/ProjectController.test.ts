// ProjectController.test.ts
import { createProject, updateProject } from './ProjectController';
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

describe("ProjectController", () => {
  const xata = getXataClient();
  
  describe("createProject", () => {
    it("should create a project and return it", async () => {
      const req = mockRequest({ name: "New Project", teamId: "teamId" }, {});
      const res = mockResponse();

      jest.spyOn(xata.db.Team, "read").mockResolvedValueOnce({ id: "teamId" }); // Team exists
      jest.spyOn(xata.db.Project, "create").mockResolvedValueOnce({ id: "projectId", name: "New Project" });

      await createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "projectId", name: "New Project" });
    });

    it("should return an error if the team is not found", async () => {
      const req = mockRequest({ name: "New Project", teamId: "teamId" }, {});
      const res = mockResponse();

      jest.spyOn(xata.db.Team, "read").mockResolvedValueOnce(null); // Team not found

      await createProject(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Team not found" });
    });
  });

  describe("updateProject", () => {
    it("should update a project and return it", async () => {
      const req = mockRequest({ name: "Updated Project" }, { projectId: "projectId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Project, "update").mockResolvedValueOnce({ id: "projectId", name: "Updated Project" });

      await updateProject(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: "projectId", name: "Updated Project" });
    });

    it("should return an error if the project is not found", async () => {
      const req = mockRequest({}, { projectId: "projectId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Project, "update").mockResolvedValueOnce(null); // Project not found

      await updateProject(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
    });
  });
});
