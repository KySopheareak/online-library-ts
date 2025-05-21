import { Document, model, Schema, Types } from "mongoose";
import mongooseHidden from 'mongoose-hidden'
export interface IUser {
    _id?: Types.ObjectId,
    role: number,
    username: string;
    password: string;
    email: string | undefined;
    personal_code: string | undefined;
    first_name_kh: string | undefined;
    last_name_kh: string | undefined;
    first_name_en: string | undefined;
    last_name_en: string | undefined;
    phone_number: string | undefined;
    gender: string | undefined;
    department: Types.ObjectId | null;
    is_active?: boolean;
    avatar?: string | null;
}

export type UserDocument = Document & IUser;

const schema = new Schema({
    role: { type: Number, ref: 'tu_roles' },
    username: { type: String, required: true, unique: true },
    password: { type: String, default: null, hide: true },
    email: { type: String, default: null },
    personal_code: { type: String, default: null },
    first_name_kh: { type: String, default: null },
    last_name_kh: { type: String, default: null },
    first_name_en: { type: String, default: null },
    last_name_en: { type: String, default: null },
    phone_number: { type: String, default: null },
    gender: { type: String, enum: ['M', 'F'] },
    department: { type: Types.ObjectId, ref: "tu_departments", default: null },
    is_active: { type: Boolean, default: true },
    avatar: { type: String, default: null },
}, { timestamps: true }).plugin(mongooseHidden(), { hidden: { _id: false } })


export default model<UserDocument>('td_users', schema);