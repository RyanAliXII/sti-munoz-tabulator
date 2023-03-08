import { AnyObject, ObjectSchema, ObjectShape } from "yup";
import { Request, Response, NextFunction } from "express";

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
