import { AnyObject, ObjectSchema, ObjectShape } from "yup";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
export const validateAndRedirectOnFail = (
  validationSchema: ObjectSchema<AnyObject>,
  errorMessage = "",
  redirectPathOnFail = ""
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validationSchema.validate(req.body);
      next();
    } catch {
      return res.redirect(redirectPathOnFail);
    }
  };
};

export const validateJSON = (
  validationSchema: ObjectSchema<AnyObject>,
  errorData = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validationSchema.validate(req.body);
      next();
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json(errorData);
    }
  };
};
