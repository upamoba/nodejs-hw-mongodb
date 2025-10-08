import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(72).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(72).required(),
});

export const sendResetEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object({
    token: Joi.string().min(10).required(),
    password: Joi.string().min(8).required(),
});
