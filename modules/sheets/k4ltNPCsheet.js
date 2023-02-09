export default class k4ltNPCsheet extends ActorSheet{
    get template(){
        return `systems/k4lt/templates/sheets/npc-sheet.hbs`;
    }

    getData(){
        const data = super.getData();
        data.moves = data.items.filter(function(item) {return item.type == "move" || "advantage" || "disadvantage" || "darksecret" || "relationship"} );
        console.log(data);
        return data;
    }}
