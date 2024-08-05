import { FieldValidationError } from "express-validator";
import _ from "lodash";


export const errorResponse = (errors: FieldValidationError[]) => {
    return _.map(errors, (e) => {
      return { type: e.path, message: [e.msg] };
    });
  };
  