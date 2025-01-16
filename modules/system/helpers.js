export default function registerHandlebarsHelpers() {
  const woundImages = [
    "blank.webp",
    "bleeding-wound.webp",
    "sticking-plaster.webp"
  ];
  const conditionImages = [
    "blank.webp",
    "checked.webp"
  ];
  const advancementImages = [
    "blank.webp",
    "checked.webp"
  ];
  const bloodImages = [
    "blood1.webp",
    "blood2.webp",
    "blood3.webp",
    "blood4.webp",
    "blood5.webp",
    "blood6.webp",
    "blood7.webp",
    "blood8.webp",
    "blood9.webp",
    "blood10.webp"
  ];
  const path = "systems/k4lt/assets/";

  Handlebars.registerHelper("getWoundsImage", function (woundState) {
    switch (woundState) {
      case "none":
        return path + woundImages[0];
      case "unstabilized":
        return path + woundImages[1];
      case "stabilized":
        return path + woundImages[2];
    }
  });

  Handlebars.registerHelper("getConditionsImage", function (conditionState) {
    switch (conditionState) {
      case "none":
        return path + conditionImages[0];
      case "checked":
        return path + conditionImages[1];
      default:
        return path + conditionImages[0]; // default case
    }
  });

  Handlebars.registerHelper("getAdvancementsImage", function (advancementState) {
    switch (advancementState) {
      case "none":
        return path + advancementImages[0];
      case "checked":
        return path + advancementImages[1];
      default:
        return path + advancementImages[0]; // default case
    }
  });

  Handlebars.registerHelper("getBloodBackground", function () {
    const randomIndex = Math.floor(Math.random() * bloodImages.length);
    const imagePath = path + "blood/" + bloodImages[randomIndex];

    console.log("path", imagePath);

    return imagePath;
  });
}
