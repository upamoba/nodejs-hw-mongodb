import { Schema, model }  from "mongoose";
import mongoose from "mongoose";



const userSchema = new Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 30  },
    email: { type: String, required: true, unique: true,lowercase: true, trim: true, index: true },
    password: { type: String, required: true },

}, { timestamps: true,});
export const User = model('user', userSchema);


