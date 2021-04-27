console.log("app.js loaded");

function init() {
    console.log("init() called");
    d3.csv("../../assets/data/data.csv").then(function(data){
        console.log(data);
    });
}

init();
