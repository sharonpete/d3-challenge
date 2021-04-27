console.log("app.js loaded");
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select div "scatter", append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

// Append a group to the SVG area and 'translate' it to
// the margins set in the 'chartMargin' object
var chartGroup = svg.append("g")
            .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


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
