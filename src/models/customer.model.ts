import { Document, model, Schema, Types } from "mongoose";
import mongooseHidden from 'mongoose-hidden'
export interface ICustomer {
    _id?: Types.ObjectId,
    name: String,
    email: String,
    address: String,
    phone: String,
}

export type CustomerDocument = Document & ICustomer;

const schema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    address: {type: String, require: true},
    phone: {type: String, require: true},
}, { timestamps: true }).plugin(mongooseHidden(), { hidden: { _id: false } })


export default model<CustomerDocument>('customers', schema);