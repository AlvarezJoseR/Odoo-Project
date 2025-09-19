const Joi = require('joi');

const validate = (schema) => (req, res, next) => {

  const { error, value } = schema.validate(req.body, { abortEarly: false });


  if (error) {

    return res.status(422).json({
      message: "Validación fallida",
      details: error.details.map(d => d.message.replace(/["']/g, ''))
    });
  }


  req.body = value;
  next();
};

module.exports = validate;
