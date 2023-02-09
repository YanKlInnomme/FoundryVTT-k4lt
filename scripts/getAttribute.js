function getAttribute(){

    let d=new Dialog({
        title: "Endure Harm",
        content: 'This function is not yet working. Please ensure Harm value is in the "Situational Modifier" field and roll Endure Injury again.',
        default: 'one',
        buttons:{
              one: {label: "Ok",
                callback: () => console.log("OK")
                   }
            },
    
      });
      d.render(true);
}