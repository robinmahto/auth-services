import { checkSchema } from "express-validator";

export default checkSchema({
    firstName: {
        errorMessage: "firstName is required.",
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: "lastName is required.",
        notEmpty: true,
        trim: true,
    },
    email: {
        errorMessage: "Email is required.",
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: "Email is required.",
        notEmpty: true,
        trim: true,
    },
});
