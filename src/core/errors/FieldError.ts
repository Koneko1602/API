import { FieldError } from './APIErrorResult';

export const createErrorsMessages = (
    errors: FieldError[],
): { errorsMessages: FieldError[] } => {
    return { errorsMessages: errors };
};