console.log("app.js loaded");
// Define SVG area dimensions
var svgWidth = 460;
var svgHeight = 400;

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
            .attr("width", svgWidth)
            .attr("height", svgHeight);
            

// Append a group to the SVG area and 'translate' it to
// the margins set in the 'chartMargin' object
var chartGroup = svg.append("g")
            .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]),
            d3.max(data, d => d[chosenXAxis])
    ])
    .range([0, chartWidth]);
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]),
            d3.max(data, d => d[chosenYAxis])
    ])
    .range([chartHeight, 0]);
    return yLinearScale;
}

// function used for update xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(2000)
        .call(bottomAxis);
    
    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(2000)
        .call(leftAxis);
    return yAxis;
}


// function used for updating circles group with a transition 
// to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(5000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    
    return circlesGroup;

}

function updateToolTip(chosenXAxis, circlesGroup) {
    var label;

    if (chosenXAxis === "poverty") {
        label = "In Poverty (%)";
    } 
    else if (chosenXAxis === "age") {
        label = "Age (Median)";
    } else {
        label = "Household Income (Median)";
    }

    if (chosenYAxis === "obesity") {
        ylabel = "Obese (%)";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes (%)";
    } else {
        ylabel = "Lacks Healthcare (%)";
    }



    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([10, 10])
        .html(function(d) {
            return (`${d.state_abbr} <br> ${label} ${d[chosenXAxis]} <br> ${ylabel} ${d[chosenYAxis]}`);
        });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        return circlesGroup;
}


d3.csv("../../assets/data/data.csv").then(function(data, err){
    if (err) throw err;

    console.log(data);
    //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,
    // healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,
    //smokes,smokesLow,smokesHigh
    var states = data.map(data => data.state);
    var state_abbr = data.map(data => data.abbr);
    // console.log(`States: ${states}`);
    // console.log(`State abbrev: ${state_abbr}`);
    
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;

        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;

        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;

        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;

        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;

    })
    
    var poverty = data.map(data => data.poverty);
    var povertyMoe = data.map(data => data.povertyMoe);

    var age = data.map(data => data.age);
    var ageMoe = data.map(data => data.ageMoe);

    var income = data.map(data => data.income);
    var incomeMoe = data.map(data => data.incomeMoe);

    var healthcare = data.map(data => data.healthcare);
    var healthcareHigh = data.map(data => data.healthcareHigh);
    var healthcareLow = data.map(data => data.healthcareLow);

    
    var smokes = data.map(data => data.smokes);
    var smokesLow = data.map(data => data.smokesLow);
    var smokesHigh = data.map(data => data.smokesHigh);

    var obesity = data.map(data => data.obesity);
    var obesityHigh = data.map(data => data.obesityHigh);
    var obesityLow = data.map(data => data.obesityLow);
        
    
    var xLinearScale = xScale(data, chosenXAxis);

    // Create y scale funtion
    var yLinearScale = yScale(data, chosenYAxis);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${chartWidth}, 0)`)
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 5)
        .attr("fill", "purple")
        .attr("opacity", "0.5")

    // Create group for two x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `transform(${chartWidth / 2}, ${chartHeight + 20})`);

    var smokesLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")  // value to grab for event listener
        .classed("active", true)
        .text("Smokes because this should show up somewhere");


    var obesityLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "obesity")  // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Number of billboard one hit wonders");

    // updateToolTip function
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    labelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;

                //updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updates circles with new x values TBD
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info TBD
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text  TBD
                if (chosenXAxis === "smokes") {
                    smokesLabel.classed("active", true)
                        .classed("inactive", false);
                    obesityLabel.classed("active", false)
                        .classed("inactive", true);
                } else {
                    smokesLabel.classed("active", false)
                        .classed("inactive", true);
                    obesityLabel.classed("active", true)
                        .classed("inactive", false);
                }

            }
        });
}).catch(function(error) {
    console.log(error);
});


    // var x = d3.scaleLinear()
    //         .domain([0, d3.max(ages, d => d.age)])
    //         //.domain([0, 100])
    //         .range([0, chartHeight]);
    // svg.append("g")
    //     .call(d3.axisBottom(x));

    // var y = d3.scaleLinear()
    //         .domain([0, d3.max(smokes, d => d.smokes)])
    //         //.domain([0,100])
    //         .range([chartWidth, 0]) ///TBD
    // svg.append("g")
    //     .call(d3.axisLeft(y));

    // svg.append("g")
    //     .selectAll("dot")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //         .attr("cx", data.age )
    //         .attr("cy", data.smokes)
    //         .attr("r", 1.5)
    //         .style("fill", "#69b3a2");


