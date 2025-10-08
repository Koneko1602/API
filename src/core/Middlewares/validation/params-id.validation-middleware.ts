import { param } from 'express-validator';
import { ObjectId } from 'mongodb';
export const idValidation = param('id')
    .exists().withMessage('ID is required')
    .isString().withMessage('ID must be a string')
    .isLength({ min: 1 }).withMessage('ID must not be empty')

export const blogIdValidation = param('blogId')
    .exists().withMessage('Blog ID is required')
    .isString().withMessage('Blog ID must be a string')
    .isLength({ min: 1 }).withMessage('Blog ID must not be empty')
    .custom((value: string) => {
    // Проверяем, может ли строка быть преобразована в валидный ObjectId
    if (!ObjectId.isValid(value)) {
        // Если формат неверный, выбрасываем ошибку, которая приведет к 400 Bad Request
        throw new Error('Blog ID must be a valid MongoDB ObjectId');
    }
    return true;
});