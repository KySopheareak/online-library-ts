import { Request, Response } from "express";
import FileModel from "../models/file.model";
import sharp from "sharp";

export default [
  {
    path: "/upload",
    method: "post",
    file: true,
    handler: async (req: Request, res: Response) => {
      try {
        const file = req.file;
        console.log("===> File: ", file);

        if (!file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        let buffer = file.buffer;
        let mimetype = file.mimetype;

        if (file.mimetype.startsWith("image/")) {
          buffer = await sharp(file.buffer).jpeg({ quality: 60 }).toBuffer();
          mimetype = "image/jpeg";
        }

        const savedFile = await FileModel.create({
          filename: file.originalname,
          originalname: file.originalname,
          path: "memory",
          size: buffer.length,
          mimetype: mimetype,
          buffer: buffer,
        });

        res.json({ message: "File uploaded", file: savedFile });
      } catch (error) {
        console.error("===> Upload Error: ", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  },

  {
    path: "/file/:id",
    method: "get",
    handler: async (req: Request, res: Response) => {
      try {
        const file = await FileModel.findById(req.params.id);
        if (!file || !file.buffer) {
          return res.status(404).json({ message: "File not found" });
        }
        res.set("Content-Type", file.mimetype);
        res.set("Content-Disposition", `inline; filename="${file.filename}"`);
        res.send(file.buffer);
      } catch (error) {
        console.error("===> Get File Error: ", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  },
];
