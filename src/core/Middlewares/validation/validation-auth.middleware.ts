import { Request, Response, NextFunction } from 'express';
import {FieldValidationError, ValidationError, validationResult} from 'express-validator';
import { HttpStatus } from '../../types/http-statuses';
import {createErrorMessages} from "./input-validation-result.middleware";
import {ValidationErrorType} from "../../types/validationError";



const formaValidationError = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        status: HttpStatus.BadRequest,
        source: expressError.path,
        detail: expressError.msg,
    };
};
export const inputValidationAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)
        .formatWith(formaValidationError)
        .array(); // ← убрали onlyFirstError: true, чтобы возвращать ВСЕ ошибки

    if (errors.length > 0) {
        console.log('[VALIDATION FAIL] Errors:', errors); // ← полезно для дебага
        res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
        return;
    }

    next();
};