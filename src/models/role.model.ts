import { Document, model, Schema } from "mongoose";

export interface IRole {
    _id: number;
    name: string;
    name_kh: string;
}

export type RoleDocument = Document & IRole;

const schema = new Schema({
    _id: Number,
    name: String,
    name_kh: String,
}, { timestamps: true });

export default model<RoleDocument>('tu_roles', schema);