export async function attributeAsk() {
  // Stocke les noms d'attributs dans un tableau plutôt que de les stocker individuellement
  const attributes = [
    "None",
    "Willpower",
    "Fortitude",
    "Reflexes",
    "Reason",
    "Intuition",
    "Perception",
    "Coolness",
    "Violence",
    "Charisma",
    "Soul"
  ];

  // Utilise la méthode map() pour générer les options du sélecteur à partir du tableau d'attributs
  const options = attributes.map((attribute) => {
    // Localise chaque nom d'attribut
    const localizedAttribute = game.i18n.localize(`k4lt.${attribute}`);
    // Retourne une chaîne HTML pour chaque option
    return `<option value="${attribute.toLowerCase()}">${localizedAttribute}</option>`;
    // Utilise la méthode join() pour joindre les options du sélecteur en une seule chaîne
  }).join("");

  // Utilise une promesse pour attendre la sélection de l'utilisateur
  const result = await new Promise((resolve) => {
    new Dialog({
      title: game.i18n.localize("k4lt.AskAttribute"),
      content: `<div class="endure-harm-dialog">
        <label>${game.i18n.localize("k4lt.Attribute")}</label>
        <select id="attribute_value">${options}</select>
      </div>`,
      buttons: {
        one: {
          label: "Ok",
          // Résout la promesse avec la valeur sélectionnée par l'utilisateur
          callback: () => {
            resolve({ attribute_value: document.getElementById("attribute_value").value });
          }
        }
      }
    }).render(true);
  });

  // Retourne directement la valeur de attribute_value extraite de la promesse résolue
  return result.attribute_value;
}

/* export async function attributeAsk(){
    let boxoutput = await new Promise(resolve => {
        const none = game.i18n.localize("k4lt.None")
        const willpower = game.i18n.localize("k4lt.Willpower")
        const fortitude = game.i18n.localize("k4lt.Fortitude")
        const reflexes = game.i18n.localize("k4lt.Reflexes")
        const reason = game.i18n.localize("k4lt.Reason")
        const intuition = game.i18n.localize("k4lt.Intuition")
        const perception = game.i18n.localize("k4lt.Perception")
        const coolness = game.i18n.localize("k4lt.Coolness")
        const violence = game.i18n.localize("k4lt.Violence")
        const charisma = game.i18n.localize("k4lt.Charisma")
        const soul = game.i18n.localize("k4lt.Soul")
        new Dialog({
          title: game.i18n.localize("k4lt.AskAttribute"),
          content: `<div class="endure-harm-dialog"><label>${game.i18n.localize("k4lt.Attribute")}
          </label>
        <select id="attribute_value">
        <option value ="none">${none}</option>
        <option value="willpower">${willpower}</option>
        <option value="fortitude">${fortitude}</option>
        <option value="reflexes">${reflexes}</option>
        <option value="reason">${reason}</option>
        <option value="intuition">${intuition}</option>
        <option value="perception">${perception}</option>
        <option value="coolness">${coolness}</option>
        <option value="violence">${violence}</option>
        <option value="charisma">${charisma}</option>
        <option value="soul">${soul}</option>
      </select>
          </div>`,
          default: 'one',
          buttons: {
            one: {
              label: "Ok",
              callback: () => {
                resolve({ "attribute_value": document.getElementById("attribute_value").value })
              }
            }
          }
        }).render(true);

        
      })

      return boxoutput.attribute_value;
} */