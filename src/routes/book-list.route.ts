import { Request, Response } from "express";
import BookListController from "../controllers/book-list.controller";
import ResponseUtil from "../utils/ResponseUtil";
import { IBook } from "../models/book.model";

export default [
  {
    path: "/books",
    method: "get",
    handler: async (req: Request, res: Response) => {
      try {
        const { search, category } = req.body;

        const filter: Partial<{ search: string; category: any;}> = {};

        if (search) filter.search = search;
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
      const { title, author, price, stock, category, description } = req.body;

      if (!title || !author || !price || !stock || !category || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const bookData = { title, author, price, stock, category, description };
      const newBook = await BookListController.createBookHandler(bookData, req, res);

      return newBook;
      } catch (error) {
        console.error("===> Route Error: ", error);
        return res.status(500).json({ message: "Unexpected error in route" });
      }
    },
  },

];
