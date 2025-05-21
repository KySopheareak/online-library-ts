import { Request, Response } from "express";
import { upload } from "../middleware/upload.middleware";

export default [
    {
        path: "/upload",
        method: "post",
        middleware: [upload.single("file")],
        handler: async (req: Request, res: Response) => {
        try {
            if (!req.file) return res.status(400).json({ message: "No file uploaded" });

            res.status(201).json({
              message: "File uploaded successfully",
              filename: req.file.filename,
            });

        } catch (error) {
            console.error("===> Fetching Error: ", error);
        }
        },
    },

];
