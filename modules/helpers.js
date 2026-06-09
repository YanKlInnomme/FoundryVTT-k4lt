// helpers.js
export default function registerHandlebarsHelpers() {
  const path = "systems/k4lt/assets/";
  const conditionImages = ["blank.webp", "checked.webp"];
  const advancementImages = ["blank.webp", "checked.webp"];
  /* ----------------------------------------- */
  /* WOUNDS                                    */
  /* ----------------------------------------- */
  Handlebars.registerHelper("getWoundsImage", (state) => {
    switch (state) {
      case "unstabilized": return `${path}bleeding-wound.webp`;
      case "stabilized":   return `${path}sticking-plaster.webp`;
      default:             return `${path}blank.webp`;
    }
  });
  /* ----------------------------------------- */
  /* CONDITIONS                                */
  /* ----------------------------------------- */
  Handlebars.registerHelper("getConditionsImage", (state) => {
    switch (state) {
      case "checked": return path + conditionImages[1];
      default:        return path + conditionImages[0];
    }
  });
  /* ----------------------------------------- */
  /* GENERIC HELPERS                           */
  /* ----------------------------------------- */
  /* -- checks whether a value is in an array -- */
  Handlebars.registerHelper("includes", (array, value) => Array.isArray(array) && array.includes(value));
  /* -- strict equality -- */
  Handlebars.registerHelper("eq", (a, b) => a === b);
  /* -- strict less than -- */
  Handlebars.registerHelper("lt", (a, b) => a < b);
  /* -- generates a range of values -- */
  Handlebars.registerHelper("range", (start, end) => Array.from({ length: end - start }, (_, i) => i + start));
  /* -- capitalize the first letter -- */
  Handlebars.registerHelper("capitalize", (value) => {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  });
  /* -- removes <p> tags from an HTML string -- */
  Handlebars.registerHelper("stripParagraph", (html) => {
    return html?.replace(/^<p[^>]*>/i, "")?.replace(/<\/p>$/i, "");
  });
}