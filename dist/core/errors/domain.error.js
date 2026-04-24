"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainError = void 0;
class DomainError extends Error {
    constructor(detail, code, source) {
        super(detail);
        this.code = code;
        this.source = source;
    }
}
exports.DomainError = DomainError;
//# sourceMappingURL=domain.error.js.map