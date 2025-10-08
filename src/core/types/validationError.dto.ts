import { HttpStatus } from './http-statuses';
import {FieldError} from "../errors/APIErrorResult";

type ValidationErrorOutput = {
    status: HttpStatus;
    detail: string;
    source: { pointer: string };
    code: string | null;
};

export type ValidationErrorListOutput = { errorsMessages: FieldError[] };