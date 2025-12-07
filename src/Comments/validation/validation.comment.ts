import {body} from "express-validator";


const contentValidation = body("content")
    .isString()
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage("Content must be 20-300 characters long");


export const commentValidation = {
    contentValidation
}