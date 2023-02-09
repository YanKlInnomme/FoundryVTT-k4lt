export async function attributeAsk(){
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
}