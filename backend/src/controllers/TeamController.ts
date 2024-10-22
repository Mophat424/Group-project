import { Request, Response } from "express";
import { getXataClient } from "../xata"; // Import the Xata client
const xata = getXataClient();

// Define the Team interface (ensure this matches your Xata schema)
interface Team {
  id: string;
  name: string;
  description: string;
  adminId: string;
  members: string[];
}

// Define a custom Request type to include the user object
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

// Join a team
export const joinTeam = async (req: Request, res: Response): Promise<Response | void> => {
  const userId = req.user!.id; // Use non-null assertion since authMiddleware guarantees `user` exists
  const { teamId } = req.body;

  try {
    // Fetch the team from the database and safely cast it
    const team = await xata.db.Team.read(teamId);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const castedTeam = team as unknown as Team; // Safe type casting after checking

    // Check if user is already a member
    if (castedTeam.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this team" });
    }

    // Add user to the team's members array
    await xata.db.Team.update(teamId, {
      members: [...castedTeam.members, userId],
    });

    return res.json({ message: "Successfully joined the team" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create a new team
export const createTeam = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, description } = req.body;
  const adminId = req.user!.id; // Use non-null assertion

  try {
    // Create a new team record in the database
    const team = await xata.db.Team.create({ name, description, adminId });
    return res.status(201).json(team); // Return the created team
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};