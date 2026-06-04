/**
 * Validation Middleware — Zod Schema Wrapper
 * Takes a Zod schema and validates req.body against it.
 * On success, attaches parsed data to req.validatedBody.
 * On failure, returns 400 with structured field errors.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = {};
      const issues = result.error.issues || result.error.errors || [];

      issues.forEach((err) => {
        const field = err.path.join('.') || '_root';
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });

      return res.status(400).json({
        message: 'Validasi gagal',
        errors: fieldErrors,
      });
    }

    // Attach validated & transformed data
    req.validatedBody = result.data;
    next();
  };
};

module.exports = validate;
