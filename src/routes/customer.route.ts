import { Request, Response } from "express";
import CustomerController from "../controllers/admin/customer.controller";
import { ICustomer } from "../models/customer.model";
import ResponseUtil from "../utils/ResponseUtil";


export default [
  {
    path: "/customer-list",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        const { name, email, address, phone } = req.body;

        const filter: Partial<{ name: string; email: string; address: String; phone: String;}> = {};

        if (name) filter.name = name;
        if (email) filter.email = email;
        if (address) filter.address = address;
        if (phone) filter.phone = phone;
        
        const costumers = await CustomerController.getCustomerList(filter);

        if (!costumers || costumers.length === 0) {
          return res.status(404).json({ message: "No Customer found.........!", data: costumers });
        }

        return res.status(200).json({ data: costumers});
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
    path: "/customer/create",
    method: "post",
    handler: async (req: Request, res: Response) => {
      try {
        let { name, email, address, phone } = req.body;
        if (!name || !email || !address || !phone) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const customerData: ICustomer = { name, email, address, phone };
        const customer = await CustomerController.createCustomer(customerData);

        return res.status(201).json({ message: "Customer created successfully", data: customer });
      } catch (error) {
        console.error("===> Creating Customer Error: ", error);
        ResponseUtil.failwithLog(
          req,
          res,
          500,
          "Internal Server Error",
          "CUSTOMER",
          error
        );
      }
    },
  },
];
