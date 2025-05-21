import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import UserAdminController from "../../../controllers/admin/user-admin.controller";
import { UserDocument } from "../../../models/user.model";
import { loginRule } from "../../../middleware/validations/admin/login.rule";
import ResponseUtil from "../../../utils/ResponseUtil";
import jwt from 'jsonwebtoken';

export default [
    {
        path: "/login",
        method: "post",
        validators: loginRule,
        handler: async (req: Request, res: Response) => {
            try {
                let { password, email } = req.body;
                let user = await UserAdminController.getUserByName(email) as UserDocument;
                if (!user) {
                    return res.json({ status: 0, message: 'Invalid Email or Password' });
                }

                //! Compare Password
                let isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.json({ status: 0, message: 'Invalid Email or Password' });
                }

                //! Generate Token
                const payload = {
                    id: user._id,
                    email: user.email
                };

                const token = jwt.sign(payload, process.env.secret as string, { expiresIn: process.env.token_duration as string });
                const refresh_token = jwt.sign(payload, process.env.refresh_token_secret as string, { expiresIn: process.env.refresh_token_duration as string });
                const decoded: any = jwt.verify(token, process.env.secret as string);
                const expiresIn = decoded.exp;

                let data = {
                    user,
                    token,
                    refresh_token,
                    expiresIn
                }

                return ResponseUtil.success(res, data);

            } catch (error) {
                console.log(error);
                ResponseUtil.failwithLog(req, res, 500, 'Internal Server Error', 'LOGIN', error);
            }
        }
    },
    {
        path: "/refresh-token",
        method: "post",
        authenticationRefreshToken: true,
        handler: async (req: Request, res: Response) => {
            try {
                let user = req.loginUser;

                //! Generate Token
                const payload = {
                    id: user._id,
                    email: user.email
                };

                const token = jwt.sign(payload, process.env.secret as string, { expiresIn: process.env.token_duration as string });
                const refresh_token = jwt.sign(payload, process.env.refresh_token_secret as string, { expiresIn: process.env.refresh_token_duration as string });
                const decoded: any = jwt.verify(token, process.env.secret as string);
                const expiresIn = decoded.exp;

                let data = {
                    user,
                    token,
                    refresh_token,
                    expiresIn
                }

                return ResponseUtil.success(res, data);

            } catch (error) {
                ResponseUtil.failwithLog(req, res, 500, 'Internal Server Error', 'LOGIN', error);
            }
        }
    },
];