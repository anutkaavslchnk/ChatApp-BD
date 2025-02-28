import Joi from "joi";

export const createUserSchemma=Joi.object({
    fullName:Joi.string().required(),
email:Joi.string().email().required(),
password:Joi.string().min(6).required(),
});

export const loginUserSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required(),
});