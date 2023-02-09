import { openTab } from "../../scripts/tabNavigation.js";
import {getWounds} from "../../scripts/getWounds.js"

export default class k4ltPCsheet extends ActorSheet{
  get template(){
    return `systems/k4lt/templates/sheets/pc-sheet.hbs`;
  }

  getData(){
    const data = super.getData();
    const itemData = data.data;
    data.item = itemData;
    data.data = itemData.data;
    data.moves = data.items.filter(function(item) {return item.type == "move"} );
    data.moves = data.moves.sort((a, b) => (a.name > b.name) ? 1 : -1);
    data.advantages = data.items.filter(function(item) {return item.type == "advantage"});
    data.disadvantages = data.items.filter(function(item) {return item.type == "disadvantage"});
    data.darksecrets = data.items.filter(function(item) {return item.type == "darksecret"});
    data.relationships = data.items.filter(function(item) {return item.type == "relationship"});
    data.weapons = data.items.filter(function(item) {return item.type == "weapon"});
    data.gear = data.items.filter(function(item) {return item.type == "gear"});
    data.wounds = getWounds(data.actor);
    kultLogger("PCSheet getData => ", data);
    console.log(data)
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html)

    // Drag event handler
    const dragHandler = ev => this._onDragStart(ev)

    // Helper function to make things draggable
    const makeDraggable = function (index, element) {
      // Add draggable attribute and dragstart listener.
      element.setAttribute('draggable', true)
      element.addEventListener('dragstart', dragHandler, false)
    }
    // Draggable items, including armor
    html.find('.item-draggable').each(makeDraggable)

    html.find('.item-delete').click(ev => {
      let li = $(ev.currentTarget).parents(".item-name"),
          itemId = li.attr("data-item-id");
      kultLogger("Delete Item => ", { currentTarget: ev.currentTarget, li, itemId })
      this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    });

    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    html.find('.item-show').click(ev => {
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.items.get(li.data("itemId"));
      kultLogger("Show Item => ", item);
      var effect;
      if (item.data.type == "disadvantage" || item.data.type == "advantage"){
        effect = item.data.data.effect;
      }
      else if (item.data.type == "move"){
        effect = item.data.data.trigger;
      }
      else if (item.data.type == "weapon"){
        effect = item.data.data.special;
      }
      else if (item.data.type == "gear" || item.data.type == "darksecret"){
        effect = item.data.data.description;
      }
      const html = "<div class='move-name'>" + item.name + "</div><div>"+effect+"</div>";
      ChatMessage.create({ content: html, speaker: ChatMessage.getSpeaker({alias: this.name})});
    });

    html.find('.stability-check').click(ev =>{
      stability();
    });

    html.find('.token-add').click(ev =>{
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      let newtokens = Number(item.data.data.tokens) + 1;
      kultLogger("Add Tokens => ", { currentTokens:item.data.data.tokens, newTokens: newtokens });
      item.update({'data.tokens': newtokens});
    })

    html.find('.move-roll').click(ev =>{
      const li = $(ev.currentTarget).parents(".item-name");
      this.actor.moveroll(li.data("itemId"));
    })

    html.find('.stability-minus').click(ev =>{
      let stability_current = Number(this.actor.data.data.stability.value);
      if (stability_current < 9){
        let stability_new = stability_current + 1;
        this.actor.update({'data.stability.value': stability_new});
        ChatMessage.create({ content: `${this.actor.name} ${game.i18n.localize("k4lt.LostStability")}`, speaker: ChatMessage.getSpeaker({alias: this.name})});
      } else {
        ui.notifications.warn(game.i18n.localize("k4lt.PCIsBroken"))
      }
    });

    html.find('.stability-plus').click(ev =>{
      let stability_current = Number(this.actor.data.data.stability.value);
      if (stability_current > 0){
        let stability_new = stability_current - 1;
        this.actor.update({'data.stability.value': stability_new});
        ChatMessage.create({ content: `${this.actor.name} ${game.i18n.localize("k4lt.HealedStability")}`, speaker: ChatMessage.getSpeaker({alias: this.name})});
      } else{
        ui.notifications.warn(game.i18n.localize("k4lt.PCIsComposed"))
      }
    });

    html.find('.reveal-hidden').click(ev =>{
      document.getElementsById("hidden_text").style.display = "block";
    });

    html.find('.tabButton').click(ev =>{
      const li = $(ev.currentTarget).attr("data-tab");
      const name = this.actor.id;
      openTab(name, li);
    })

    html.find('.token-spend').click(ev =>{
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
      let newtokens = Number(item.data.data.tokens) -1;
      item.update({'data.tokens': newtokens});
    })

    html.find('.token-add').click(ev =>{
      const li = $(ev.currentTarget).parents(".item-name");
      const item = this.actor.getEmbeddedDocument("Item", li.data("itemId"));
      let newtokens = Number(item.data.data.tokens) + 1;
      item.update({'data.tokens': newtokens});
    })
  }
}
