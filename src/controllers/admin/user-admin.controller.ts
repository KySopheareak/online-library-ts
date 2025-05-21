import { Request, Response } from 'express';
import UserModel, { UserDocument } from "../../models/user.model";
import { Types, isValidObjectId } from 'mongoose'
export default class UserAdminController {

    /**
     * Get User by username
     * @param username 
     * @returns 
     */
    public static async getUserByName(email: string) {
        try {
            let user = await UserModel.findOne({ email: email }).populate({ path: 'role' }) as UserDocument;
            if (!user) return null;

            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
