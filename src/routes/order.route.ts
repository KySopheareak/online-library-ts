import { Request, Response } from "express";
import ResponseUtil from "../utils/ResponseUtil";
import { IOrder } from "../models/order.model";
import OrderController from "../controllers/admin/order.controller";
import BookListController from "../controllers/admin/book-list.controller";

export default [
  {
    path: "/order-list",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        const { order_date, status } = req.body;

        const filter: Partial<{order_date: Date; status: String;}> = {};

        if (order_date) filter.order_date = order_date;
        if (status) filter.status = status;
        
        const orders = await OrderController.getOrderList(filter);

        if (!orders || orders.length === 0) {
          return res.status(404).json({ message: "No Customer found.........!", data: orders });
        }

        return res.status(200).json({ data: orders});
      } catch (error) {
        console.error("===> Fetching Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "ORDER",
          error
        );
      }
    },
  },

  {
    path: "/order/create",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        let { customer, books, order_date, status } = req.body;
        if(!customer || !books || !Array.isArray(books)) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const bookIds = books.map((item) => item.book);
        const bookDetails = await BookListController.getBooksByIds(bookIds);
        let total_amount = 0
        for (const book of bookDetails) {
          if (typeof book.price !== "number" || isNaN(book.price)) {
            return res.status(400).json({ message: `Invalid price for book ${book._id}` });
          }
          total_amount += book.price;
        }

        const orderData: IOrder = {customer, books, total_amount, order_date, status};
        const order = await OrderController.createOrder(orderData)
        
        return res.status(200).json({message: "Create successfully!", data: order})
      } catch (error) {
        console.error("===> Fetching Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "ORDER",
          error
        );
      }
    },
  },
];
