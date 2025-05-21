import { Document, model, Schema, Types } from "mongoose";
import mongooseHidden from 'mongoose-hidden'
import { IBook } from "./book.model";

const BookSchema = new Schema<IBook>({
    book: { type: Schema.Types.ObjectId, ref: 'books', required: true },
    // amount: { type: Number, required: true },
    // total_price: { type: Number, required: true }
},{ timestamps: false }).plugin(mongooseHidden(), { hidden: { _id: true } });

export interface IOrder {
    _id?: Types.ObjectId,
    customer: Schema.Types.ObjectId;
    books: any[];
    total_amount: number;
    order_date: Date;
    status: 'pending' | 'completed';
}
  
export type OrderDocument = Document & IOrder;

const schema = new Schema<IOrder>({
    customer: { type: Schema.Types.ObjectId, ref: 'customers', required: true },
    books: [{ type: BookSchema }],
    total_amount: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
}, { timestamps: true }).plugin(mongooseHidden(), { hidden: { _id: false } })


export default model<OrderDocument>('orders', schema);