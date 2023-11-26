import Handlebars from "handlebars";

export function parseVariable(value: string | null, workflowContext: { [key: string]: any }) {
  if (!value) {
    return null;
  }

  try {
    const compiled = Handlebars.compile(value);
    let result = compiled(workflowContext);
    if (result.toString() === "[object Object]") {
      result = JSON.stringify(result);
    }
    return result;
  } catch (e: any) {
    return "Error parsing string: " + e.message;
  }
}

export function compile(template: string, data: any) {
  const compiled = Handlebars.compile(template);
  let result = compiled(data);
  // replace more three or more newlines with two newlines
  var times = 0;
  do {
    result = result.replace(/\n{3,}/gm, "\n\n");
    times++;
    if (times > 100) {
      break;
    }
  } while (result.match(/\n{3,}/gm));
  // replace tabs with empty string
  result = result.replace(/\t/gm, "");
  // replace four spaces with empty string
  result = result.replace(/ {4}/gm, "");

  // remove comments within <!-- --> and also the <!-- --> themselves and also the linebreaks they are on
  result = result.replace(/<!--[\s\S]*?-->\n?/gm, "");
  result = result
    .replace(/\n{3,}/gm, "\n\n")
    .replace(/\t/gm, "")
    .replace(/ {4}/gm, "");
  return result;
}
