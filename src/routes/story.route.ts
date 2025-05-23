import { Request, Response } from "express";
import StoryModel from "../models/story.model";

export default [
  {
    path: "/story/create",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        const { content } = req.body;
        const story = await StoryModel.create({ content });
        res.status(201).json({ message: "Story created", data: story });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  },
];