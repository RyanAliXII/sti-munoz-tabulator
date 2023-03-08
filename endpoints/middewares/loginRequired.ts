import { NextFunction, Request, Response } from "express";
import { request } from "http";

const loginRequired = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      throw "User not logged In";
    }
    next();
  } catch {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }
};

export default loginRequired;
