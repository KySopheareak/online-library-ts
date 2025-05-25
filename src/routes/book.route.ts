import { Request, Response } from "express";
import BookListController from "../controllers/book-list.controller";
import ResponseUtil from "../utils/ResponseUtil";
import IBook from "../models/book.model";

export default [
  {
    path: "/book",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        const { title, category } = req.body;

        const filter: Partial<{ title: string; category: any }> = {};

        if (title) filter.title = title;
        if (category) filter.category = category;

        await BookListController.getBookList(filter, res);
      } catch (error) {
        console.error("===> Fetching Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "BOOK_LIST",
          error 
        );
      }
    },
  },

  {
    path: "/book/create",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        const { title, author, category, description, full_story, file } = req.body;

        if (!title || !author || !category || !description || !full_story || !file) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const bookData = { title, author, category, description, full_story, file };
        const newBook = await BookListController.createBookHandler(
          bookData,
          req,
          res
        );

        return newBook;
      } catch (error) {
        console.error("===> Route Error: ", error);
        return res.status(500).json({ message: "Unexpected error in route" });
      }
    },
  },

  {
    path: "/book/:id",
    method: "get",
    handler: async (req: Request, res: Response) => {
      try {
        const book = await IBook.findById(req.params.id)
          .populate({path: 'category', select: 'name_kh name_en -_id'})
          .populate({path: 'file', select: 'filename originalname _id'})
          .populate({path: 'full_story', select: 'content'});
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json({
          message: 'SUCCESS!',
          data: book,
          status: 1,
        });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    },
  },

  {
    path: "/book/:id",
    method: "patch",
    handler: async (req: Request, res: Response) => {
      try {
        const { title, author, category, description, full_story, file } = req.body;
        const bookData = { title, author, category, description, full_story, file };
        const updatedBook = await IBook.findByIdAndUpdate(
          req.params.id,
          bookData,
          { new: true }
        );

        if (!updatedBook) return res.status(404).json({ message: "Book not found" });

        res.json(updatedBook);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
];
