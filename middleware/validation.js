import Joi from "joi";
import joi_objectId from "joi-objectid";

export default () => {
  Joi.objectId = joi_objectId(Joi);
};
