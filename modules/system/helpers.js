export default function registerHandlebarsHelpers() {
  const images = [
    "blank.webp",
    "bleeding-wound.webp",
    "sticking-plaster.webp"
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

  Handlebars.registerHelper("getWoundsImage", function (state) {
    switch (state) {
      case "none":
        return path + images[0];
      case "unstabilized":
        return path + images[1];
      case "stabilized":
        return path + images[2];
    }
  });

  Handlebars.registerHelper("getBloodBackground", function () {
    const randomIndex = Math.floor(Math.random() * bloodImages.length);
    const imagePath = path + "blood/" + bloodImages[randomIndex];

    console.log("path", imagePath);

    return imagePath;
  });
}
