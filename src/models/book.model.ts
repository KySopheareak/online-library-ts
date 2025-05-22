import { Document, model, Schema, Types } from "mongoose";
import mongooseHidden from 'mongoose-hidden'

export interface IBook {
    title: String,
    author: String,
    category: String[],
    description: String,
    full_story?: any,
    file?: Types.ObjectId
}

export type BookDocument = Document & IBook;

const schema = new Schema({
    title: {type: String, require: true},
    author: {type: String, require: true},
    category: {type: [Types.ObjectId], ref: 'category', require: true},
    description: {type: String, require: false},
    full_story: { type: Schema.Types.Mixed, required: false },
    file: { type: Types.ObjectId, ref: 'files', required: false },
}, { timestamps: true }).plugin(mongooseHidden(), { hidden: { _id: false } })

export default model<BookDocument>('books', schema);