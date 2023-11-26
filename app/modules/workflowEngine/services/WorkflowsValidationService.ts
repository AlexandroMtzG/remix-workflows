import Ajv from "ajv";

function validate(input: any, schema: any): string | null {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(input);
  if (!valid && validate.errors) {
    return validate.errors
      .map((f) => {
        if (f.propertyName) {
          return `${f.propertyName}: ${f.message}`;
        }
        if (f.instancePath) {
          return `${f.instancePath}: ${f.message}`;
        }
        return f.message;
      })
      .join("\n");
  }
  return null;
}

export default {
  validate,
};
