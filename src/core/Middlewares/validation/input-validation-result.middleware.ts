import {
    FieldValidationError,
    ValidationError,
    validationResult,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import {ValidationErrorListOutput} from "../../types/validationError.dto";
import {HttpStatus} from "../../types/http-statuses";
import {ValidationErrorType} from "../../types/validationError";

// Обновленная функция для соответствия тесту
export const createErrorMessages = (
    errors: ValidationErrorType[],
): ValidationErrorListOutput => {
    return {
        errorsMessages: errors.map((error) => ({ // <-- Изменено 'errors' на 'errorsMessages'
            // source (путь/имя поля) -> field
            field: error.source ?? 'general',
            // detail (сообщение) -> message
            message: error.detail,
        })),
    };
};

const formaValidationError = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        status: HttpStatus.BadRequest,
        source: expressError.path,
        detail: expressError.msg,
    };
};

export const inputValidationResultMiddleware = (
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
        .formatWith(formaValidationError)
        .array({ onlyFirstError: true });

    if (errors.length > 0) {
        console.log('[VALIDATION FAIL] Errors:', errors);  // ← лог ошибок
        res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
        return;
    }
    next();
};