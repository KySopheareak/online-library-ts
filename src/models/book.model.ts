import { Document, model, Schema, Types } from "mongoose";
import mongooseHidden from 'mongoose-hidden'
export interface IBook {
    _id?: Types.ObjectId,
    id?: Number,
    title: String,
    author: String,
    price: Number, 
    stock: Number,
    category: String [],
    description: String,
    file?: { 
        _id: Types.ObjectId,
        name: String
    }
}

export type BookDocument = Document & IBook;

const schema = new Schema({
    id: {type: Number, unique: true},
    title: {type: String, require: true},
    author: {type: String, require: true},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    category: {type: [Types.ObjectId], ref: 'category', require: true},
    description: {type: String, require: false},
    file: { 
        _id: {type: Types.ObjectId, require: true},
        name: {type: String, require: true}
    }
}, { timestamps: true }).plugin(mongooseHidden(), { hidden: { _id: false } })


export default model<BookDocument>('books', schema);