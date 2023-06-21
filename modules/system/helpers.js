export default function registerHandlebarsHelpers() {

    Handlebars.registerHelper("getWoundsImage", function (state) {
        switch (state) {
          case "none":
            return "systems/k4lt/assets/blank.webp";
          case "unstabilized":
            return "systems/k4lt/assets/bleeding-wound.webp";
          case "stabilized":
            return "systems/k4lt/assets/sticking-plaster.webp";
        }
      });

    Handlebars.registerHelper("getBloodBackground", function () {
        // Tableau contenant les noms des images disponibles
        const images = ['blood1.webp', 'blood2.webp', 'blood3.webp'];
        const path = "systems/k4lt/assets/blood/";

        // Génération d'un nombre aléatoire entre 0 et le nombre d'images moins un
        const randomIndex = Math.floor(Math.random() * images.length);

        console.log('path', path + images[randomIndex]);
        return path + images[randomIndex]; 
  });
}

