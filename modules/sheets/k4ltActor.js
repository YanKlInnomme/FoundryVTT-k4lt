import {attributeAsk} from "../../scripts/attributeAsk.js";

export default class k4ltActor extends Actor {

  prepareData(){
    super.prepareData();
    const actorData = this.data;
    if (actorData.type === 'pc') this._preparePCData(actorData);
    }

  _preparePCData(actorData){
    const data = actorData.data;
    data.disadvantages = actorData.items.filter(function(item) {return item.type == "disadvantage"});
    data.disadvantagearray = Array.from(data.disadvantages)
  }


  
  async _onCreate(data, options, user) {
    await super._preCreate(data, options, user);
    if (this.type === "pc"){
      const pack = await game.packs.get("k4lt.moves");
      const index = await pack.getIndex();
      const moveArray = await Array.from(index);
      var i;
      const newItems = []
      for (i=0; i<moveArray.length; i++){
          const move = moveArray[i];
          const finalItem = await pack.getDocument(move._id)
          newItems.push(finalItem.data);
          
      }
      console.log(newItems);
    
      this.createEmbeddedDocuments("Item", newItems);

  }
}

  async woundEffect(){
    var i;
    let modifier = 0;
    for (i=1; i<5; i++){
      if ( getProperty(this.data.data.attributes, `woundtext.majorwound${i}`) && (getProperty(this.data.data.attributes, `woundstabilized.majorwound${i}`) == "false")){
        modifier = 1
      }
    }
    return modifier;
  }  

  displayRollResult({roll, moveName, resultText, moveResultText, optionsText }) {
    ChatMessage.create({ 
      content: `
        <div class='move-name'>${moveName}</div>
        <div class='move-name'>${resultText}!</div>
        <div class='move-result'>${moveResultText}</div>
        <div class='move-options'>${optionsText}</div>
        <div class='result-roll'>
          <div class='tooltip'>
            ${roll.total}
            <span class='tooltiptext'>${roll.result}</span>
          </div>
        </div>`,
      speaker: ChatMessage.getSpeaker({ alias: this.name })
    });
  };

  async moveroll(moveID){
    const actordata = this.data;
    kultLogger("Actor Data => ", actordata);

    let move = actordata.items.get(moveID);
    kultLogger("Move => ", move);

    const moveData = move.data.data;
    const moveType = moveData.type;
    const moveName = move.name
    kultLogger("Move Type => ", moveType);

    if (moveType === "passive") {
      ui.notifications.warn(game.i18n.localize("k4lt.PassiveAbility"))
    } else {
      const attr = moveData.attributemod == "ask" ? await attributeAsk() : moveData.attributemod;
      const successtext = moveData.completesuccess;
      const optionstext = moveData.options;
      const failuretext = moveData.failure;
      const partialsuccess = moveData.partialsuccess;
      const specialflag = moveData.specialflag;
      let mod = 0;
      let harm = 0;
      if (specialflag == 3) { // Endure Injury
        let boxoutput = await new Promise(resolve => {
          new Dialog({
            title: game.i18n.localize("k4lt.EndureInjury"),
            content: `<div class="endure-harm-dialog"><label>${game.i18n.localize("k4lt.EndureInjuryDialog")}</label><input id="harm_value" data-type="number" type="number"></div>`,
            default: 'one',
            buttons: {
              one: {
                label: "Ok",
                callback: () => {
                  resolve({ "harm_value": document.getElementById("harm_value").value })
                }
              }
            }
          }).render(true);
        })
        harm = boxoutput.harm_value;
      }

      if (attr != '' && attr != 'none') {
        mod = actordata.data.attributes[attr];
      }
      
      let stab = actordata.data.stability.value;
      let situation = parseInt(actordata.data.sitmod) + parseInt(actordata.data.forward);
      kultLogger("Sitmod => ", actordata.data.sitmod);

      let woundmod = await this.woundEffect();
      situation -= woundmod;

      if (actordata.data.attributes.criticalwound && actordata.data.attributes.criticalwoundstabilized != "true") { 
        situation -= 1;
      }
      if (specialflag == 1 && stab > 2) {
        situation -= 1
      };
      if (moveType == "disadvantage" && stab > 0) {
        situation -= 1
      };
      if (moveType == "disadvantage" && stab > 2) {
        situation -= 1
      };
      if (specialflag == 1 && stab > 5) {
        situation -= 1
      };
      if (moveType == "disadvantage" && stab > 5) {
        situation -=1
      };
      if (specialflag == 2 && stab > 5) {
        situation += 1
      }; 
    
      kultLogger("Attribute Mod => ", mod);
      kultLogger("Situation Mod => ", situation);
      kultLogger("Harm => ", harm);

      let r = new Roll(`2d10 + ${mod} + ${situation} - ${harm}`);
	r.roll({async:false})

      if (game.dice3d){
        await game.dice3d.showForRoll(r);
      }

      if(r.total){
        kultLogger("Roll Successful");
        this.update({"data.sitmod": 0});
        kultLogger(`Sitmod is ` + this.data.data.sitmod);
      }

      if (r.total >= 15) {
        this.displayRollResult({ roll: r, moveName, resultText:  game.i18n.localize("k4lt.Success"), moveResultText: successtext, optionsText: optionstext });
      }
      else if (r.total < 10) {
        this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.Failure"), moveResultText: failuretext, optionsText: optionstext });
      }
      else {
        this.displayRollResult({ roll: r, moveName, resultText: game.i18n.localize("k4lt.PartialSuccess"), moveResultText: partialsuccess, optionsText: optionstext });
      }
    }   
  }
}
