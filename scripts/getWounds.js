export function getWounds(actor){
    var wounddisplay = [];
    const data = actor.data.attributes;
    var i;
    for (i=1; i<5; i++){
        if ( getProperty(data, `woundtext.majorwound${i}`)){
            wounddisplay.push(`majorwound${i}`);
        }
    }
    
    for (i=1; i<5; i++){
        if (!getProperty(data, `woundtext.majorwound${i}`)){
            wounddisplay.push(`majorwound${i}`);
            break;
        }
    }
    
    return wounddisplay;
}
