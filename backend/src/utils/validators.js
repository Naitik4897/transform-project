// Filename: validators.js
// Author: Naitik Maisuriya
// Description: Joi validation schemas for request validation

import Joi from 'joi';

const authValidation = {
  register: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .pattern(/^[a-zA-Z\s]+$/)
      .messages({
        'string.pattern.base': 'First name can only contain letters and spaces',
        'any.required': 'First name is required',
      }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .pattern(/^[a-zA-Z\s]+$/)
      .messages({
        'string.pattern.base': 'Last name can only contain letters and spaces',
        'any.required': 'Last name is required',
      }),
    email: Joi.string()
      .email()
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
      }),
    role: Joi.string()
      .valid('admin', 'manager', 'qa', 'agent')
      .default('agent'),
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
  }),
};

const userValidation = {
  updateUser: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/),
    email: Joi.string()
      .email()
      .lowercase()
      .trim(),
    role: Joi.string()
      .valid('admin', 'manager', 'qa', 'agent'),
    isActive: Joi.boolean(),
  }).min(1), // At least one field must be provided
};

const taskValidation = {
  createTask: Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .required(),
    description: Joi.string()
      .max(1000),
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required(),
    priority: Joi.string()
      .valid('low', 'medium', 'high', 'critical')
      .default('medium'),
    dueDate: Joi.date()
      .greater('now'),
  }),
};

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

export {
  authValidation,
  userValidation,
  taskValidation,
  validate,
};