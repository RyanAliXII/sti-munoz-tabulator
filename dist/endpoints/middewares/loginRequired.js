"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginRequired = (req, res, next) => {
    try {
        if (!req.session.user) {
            throw "User not logged In";
        }
        next();
    }
    catch (_a) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }
};
exports.default = loginRequired;
