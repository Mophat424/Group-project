import { Request, Response } from "express";
import { getXataClient } from "../xata"; // Import the Xata client
const xata = getXataClient();

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  const { name, teamId } = req.body;

  try {
    const team = await xata.db.Team.read(teamId);
    if (!team) {
      res.status(404).json({ message: "Team not found" });
    }

    const project = await xata.db.Project.create({ name, teamId });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing project
export const updateProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name } = req.body;

  try {
    const project = await xata.db.Project.update(projectId, { name });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};