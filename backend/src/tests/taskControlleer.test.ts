// TaskController.test.ts
import { createTask, updateTask, addComment } from './TaskController';
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

describe("TaskController", () => {
  const xata = getXataClient();
  
  describe("createTask", () => {
    it("should create a task and return it", async () => {
      const req = mockRequest({ description: "New Task", projectId: "projectId" }, {});
      const res = mockResponse();

      jest.spyOn(xata.db.Project, "read").mockResolvedValueOnce({ id: "projectId" }); // Project exists
      jest.spyOn(xata.db.Task, "create").mockResolvedValueOnce({ id: "taskId", description: "New Task" });

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "taskId", description: "New Task" });
    });

    it("should return an error if the project is not found", async () => {
      const req = mockRequest({ description: "New Task", projectId: "projectId" }, {});
      const res = mockResponse();

      jest.spyOn(xata.db.Project, "read").mockResolvedValueOnce(null); // Project not found

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
    });
  });

  describe("updateTask", () => {
    it("should update a task and return it", async () => {
      const req = mockRequest({ description: "Updated Task" }, { taskId: "taskId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Task, "update").mockResolvedValueOnce({ id: "taskId", description: "Updated Task" });

      await updateTask(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: "taskId", description: "Updated Task" });
    });

    it("should return an error if the task is not found", async () => {
      const req = mockRequest({}, { taskId: "taskId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Task, "update").mockResolvedValueOnce(null); // Task not found

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });

  describe("addComment", () => {
    it("should add a comment to a task and return it", async () => {
      const req = mockRequest({ comment: "Great job!" }, { taskId: "taskId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Task, "read").mockResolvedValueOnce({ id: "taskId", comments: [] }); // Task exists
      jest.spyOn(xata.db.Task, "update").mockResolvedValueOnce({ id: "taskId", comments: ["Great job!"] });

      await addComment(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: "taskId", comments: ["Great job!"] });
    });

    it("should return an error if the task is not found", async () => {
      const req = mockRequest({ comment: "Great job!" }, { taskId: "taskId" });
      const res = mockResponse();

      jest.spyOn(xata.db.Task, "read").mockResolvedValueOnce(null); // Task not found

      await addComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Task not found" });
    });
  });
});
