import { Request, Response } from "express";
import ResponseUtil from "../utils/ResponseUtil";
import CategoryController from "../controllers/admin/category.controller";
import { ICategory } from "../models/category.model";

export default [
  {
    path: "/category-list",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        const { search, status } = req.body;

        const filter: Partial<{ search: string; status: Boolean;}> = {};

        if (search) filter.search = search;
        if (status) filter.status = status;

        await CategoryController.getcategoryList(filter, res);

      } catch (error) {
        console.error("===> Fetching Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "category-list",
          error
        );
      }
    },
  },

  {
    path: "/category/create",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        let { name_kh, name_en, status } = req.body;
        if (!name_kh || !name_en || !status) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const data: ICategory = { 
          name_kh,
          name_en,
          status 
        };
        const newCategory = await CategoryController.createCategory(data);

        return res.status(201).json({ message: "category created successfully", data: newCategory });
      } catch (error) {
        console.error("===> Creating Category Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "create-category",
          error
        );
      }
    },
  },
];
