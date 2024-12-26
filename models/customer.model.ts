require("dotenv").config();
import mongoose, {Document, Model, Schema} from "mongoose";
import { IOrder, OrderSchema } from "./order.model";
export interface ICustomer extends Document{
    name: string;
    address: string;
    contact: string;
    orders: string[];
    udhar: number;
    createdBy: string;
};

const CustomerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    orders: [String], // Use the OrderSchema for the orders property
    udhar: {type: Number},
    createdBy: { type: String, required: true },
},{timestamps: true});

// Create the model
const CustomerModel: Model<ICustomer> = mongoose.model<ICustomer>("Customer", CustomerSchema);

export default CustomerModel;