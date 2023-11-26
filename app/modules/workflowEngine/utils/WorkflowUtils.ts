export function validateIsReadOnly() {
  // TODO: Delete this. I added this function to make the public demo read-only.
  if (process.env.READ_ONLY) {
    // throw new Error("Workflows are currently read-only");
  }
}