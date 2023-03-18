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

export const validatePemissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const accountPermission = req.session?.user?.permissions ?? [];
    try {
      for (const permission of requiredPermissions) {
        if (!accountPermission.includes(permission)) {
          throw "No permission found.";
        }
      }
      next();
    } catch {
      if (req.headers["content-type"] === "application/json") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "forbidden",
        });
      }
      res.render("error/403.html");
    }
  };
};
