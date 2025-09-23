import joi from "joi";

const name = joi.string().min(3).max(20).required();
const phoneNumber = joi.string().min(6).max(20).required();
const email = joi.string().email().allow(null,'').max(50);
const isFavourite = joi.boolean();
const contactType = joi.string().valid('work','home','personal').required();
export const createContactSchema = joi.object({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType
    });
export const updateContactSchema = joi.object({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType: joi.string().valid('work','home','personal'),
    });
