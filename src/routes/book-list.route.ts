import { Request, Response } from "express";
import BookListController from "../controllers/admin/book-list.controller";
import ResponseUtil from "../utils/ResponseUtil";
import { IBook } from "../models/book.model";
import { MulterRequest, uploadBookCover } from '../middleware/upload-handler';
import { Types } from "mongoose";
import fs from 'fs';

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

  // {
  //   path: "/book/create",
  //   method: "post",
  //   handler: async (req: Request, res: Response) => {
  //     try {
  //       let { title, author, price, stock, category, description } = req.body;
  //       if (!title || !author || !price || !stock || !category || !description) {
  //         return res.status(400).json({ message: "Missing required fields" });
  //       }
  //       const bookData: IBook = { title, author, price, stock, category, description };
  //       const newBook = await BookListController.createBook(bookData);

  //       return res.status(201).json({ message: "Book created successfully", data: newBook });
  //     } catch (error) {
  //       console.error("===> Creating Book Error: ", error);
  //       ResponseUtil.failwithLog(
  //         req,
  //         res,
  //         500,
  //         "Internal Server Error",
  //         "CREATE_BOOK",
  //         error
  //       );
  //     }
  //   },
  // },

  {
    path: "/book/create",
    method: "post",
    middleware: [uploadBookCover],
    handler: async (req: Request, res: Response) => {
      try {
        console.log("===> Book Create Request Body: ", req.body);
        console.log("===> Book Create Request File: ", req.file);
        let { title, author, price, stock, category, description } = req.body;
        if (!title || !author || !price || !stock || !category || !description) {
          // Clean up uploaded file if validation fails
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Prepare book data including file reference
        const bookData: IBook = { 
          title, 
          author, 
          price: Number(price), 
          stock: Number(stock), 
          category: Array.isArray(category) ? category : [category],
          description 
        };
   
        // If file was uploaded, add its reference
        if (req.file) {
          bookData.coverImage = {
            _id: new Types.ObjectId(),
            name: req.file.filename 
          };
        }

        const newBook = await BookListController.createBook(bookData);

        return res.status(201).json({ 
          message: "Book created successfully", 
          data: newBook 
        });
      } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        console.error("===> Creating Book Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "CREATE_BOOK",
          error
        );
      }
    },
  }
];
