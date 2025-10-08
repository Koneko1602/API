import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../types/http-statuses';
import { DomainError } from './domain.error';
import {createErrorsMessages} from "./FieldError";
import { FieldError } from "./APIErrorResult";

export function errorsHandler(error: unknown, res: Response): void {
    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HttpStatus.NotFound;

        res.status(httpStatus).send(
            createErrorsMessages([
                {
                    field: 'general',
                    message: error.message,
                },
            ])
        );
        return;
    }

    if (error instanceof DomainError) {
        const httpStatus = HttpStatus.BadRequest;

        const fieldErrors: FieldError[] = [
            {
                field: error.source ?? 'unknown',
                message: error.message,
            },
        ];

        res.status(httpStatus).send(createErrorsMessages(fieldErrors));
        return;
    }

    // 🟢 ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ: FALLBACK ДЛЯ ВСЕХ НЕОБРАБОТАННЫХ ОШИБОК
    console.error('Unhandled server error:', error);

    if (!res.headersSent) {
        res.status(HttpStatus.InternalServerError).send({
            errorsMessages: [{ field: "general", message: "Internal server error" }]
        });
    }
}