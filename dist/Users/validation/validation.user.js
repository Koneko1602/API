"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
const emailValidation = (0, express_validator_1.body)("email")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage("email is not correct");
// .custom(
//     async (email: string) => {
//         const user = await usersRepository.findByLoginOrEmail(email);
//         if (user) {
//             throw new Error("email already exist");
//
//         }
//         return true;
//
//
//     });
const loginOrEmailValidation = (0, express_validator_1.body)("loginOrEmail")
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("loginOrEmail is not correct");
const loginValidation = (0, express_validator_1.body)("login")
    .isString()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage("login is not correct");
// .custom(
//     async (login: string) => {
//         const user = await usersRepository.findByLoginOrEmail(login);
//         if (user) {
//             throw new Error("login already exist");
//         }
//         return true;
//     }
// );
const passwordValidation = (0, express_validator_1.body)("password")
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("password is not correct");
exports.userValidation = {
    passwordValidation,
    emailValidation,
    loginValidation,
    loginOrEmailValidation
};
//# sourceMappingURL=validation.user.js.map