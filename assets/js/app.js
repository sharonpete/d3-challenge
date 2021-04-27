console.log("app.js loaded");


function init() {
    console.log("init() called");
    d3.csv("../../assets/data/data.csv").then(function(data){
        console.log(data);
        //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,
        // healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,
        //smokes,smokesLow,smokesHigh
        var states = data.map(data => data.state);
        var state_abbreviations = data.map(data => data.abbr);
        console.log(`States: ${states}`);
        console.log(`State abbrev: ${state_abbreviations}`);
        
        data.forEach(function(data) {
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.smokesLow = +data.smokesLow;
            data.smokesHigh = +data.smokesHigh;
        })
        var ages = data.map(data => data.age);
        console.log(`Ages: ${ages}`)

        //var ageMoe = data.map(data => data.ageMoe);
        var smokes = data.map(data => data.smokes);
        var smokesLow = data.map(data => data.smokesLow);
        var smokesHigh = data.map(data => data.smokesHigh);
         
        console.log(`Smokes: ${smokes}`);
        console.log(`SmokesLow: ${smokesLow}`);
        console.log(`SmokesHigh: ${smokesHigh}`);


    });
}

init();
