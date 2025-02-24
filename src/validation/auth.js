import Joi from "joi";

export const createUserSchemma=Joi.object({
    fullName:Joi.string().required(),
email:Joi.string().email().required(),
password:Joi.string().min(6).required(),
});