import { Document, model, Schema, Types } from "mongoose";
import mongooseHidden from 'mongoose-hidden'
export interface ICategory {
    _id?: Types.ObjectId,
    id?: Number,
    name_kh: String,
    name_en: String,
    status: Boolean
}

export type CategoryDocument = Document & ICategory;

const schema = new Schema({
    id: { type: Number, unique: true },
    name_kh: {type: String, require: true},
    name_en: {type: String, require: true},
    status: {type: Boolean, require: true}
}, { timestamps: true }).plugin(mongooseHidden(), { hidden: { _id: false } })


export default model<CategoryDocument>('category', schema);