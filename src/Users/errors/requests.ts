import {Request} from "express";
import {IdType} from "./id";
import {UserIdType} from "../../Comments/errors/UserIdType";

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParams<P> = Request<P>;
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithParamsAndBodyAndUserId<P, B, U extends IdType> = Request<P, {}, B, {}, U>;
export type RequestWithBodyAndUserId<B, U extends IdType> = Request<{}, {}, B, {}, U>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;
export type RequestWithParamsAndCommentsId<P, U extends UserIdType> = Request<P, {}, {}, {}>;
export type RequestWithParamsAndBodyAndCommentId <P, B, U extends UserIdType> = Request<P, {}, B, {}>