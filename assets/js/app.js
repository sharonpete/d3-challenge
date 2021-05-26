console.log("app.js loaded");
var whereAmI = window.location.origin;

// Define SVG area dimensions
var svgWidth = 600;
var svgHeight = 400;

// Define the chart's margins as an object
var chartMargin = {
    top: 40,
    right: 40,
    bottom: 100,
    left: 100
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
function xScale(peopleData, chosenXAxis) {
    console.log(`xScale - chosenXAxis: ${chosenXAxis}`);
    //create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(peopleData, d => d[chosenXAxis]) * 0.8,
            d3.max(peopleData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, chartWidth]);
    return xLinearScale;
}

// // function used for updating y-scale var upon click on axis label
function yScale(peopleData, chosenYAxis) {
    console.log(`yScale - chosenYAxis: ${chosenYAxis}`);
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(peopleData, d => d[chosenYAxis]),
            d3.max(peopleData, d => d[chosenYAxis])
        ])
        .range([chartHeight, 0]);
    return yLinearScale;
}

// function used for update xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom().scale(newXScale);

    xAxis.transition()
        .duration(2000)
        .call(bottomAxis);
    
    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft().scale(newYScale);

    yAxis.transition()
        .duration(2000)
        .call(leftAxis);
    return yAxis;
}


function renderCircles(circlesGroup, xScale, xAxis, yScale, yAxis) {
    circlesGroup.transition()
        .duration(5000)
        .attr("cx", d => xScale(d[xAxis]))
        .attr("cy", d => yScale(d[yAxis]));
    
           
    return circlesGroup;
}

function updateTextGroup(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis) {
    console.log("in updateTextGroup");
    
    textGroup.transition()
        .duration(4000)
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis])+5 );
        

    return textGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xlabel;
    var ylabel;

    if (chosenXAxis === "poverty") {
        xlabel = "In Poverty (%)";
    } 
    else if (chosenXAxis === "age") {
        xlabel = "Age (Median)";
    } else {
        xlabel = "Household Income (Median)";
    }

    if (chosenYAxis === "obesity") {
        ylabel = "Obese (%)";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes (%)";
    } else {
        ylabel = "Lacks Healthcare (%)";
    }
    console.log(circlesGroup);
    
  
    console.log('in updateToolTip')
 

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state} <br>${xlabel} ${d[chosenXAxis]} <br> ${ylabel} ${d[chosenYAxis]}`);
        })
        .direction('n');
       
    circlesGroup.call(toolTip);

    circlesGroup.append('rect')
        .attr('width', 100)
        .attr('height', 100);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    
    return circlesGroup;
}




// Retrieve data from the CSV file and execute everything below
d3.csv(whereAmI + "/assets/data/data.csv").then(function(peopleData, err) {
    if (err) throw err;

    //console.log(data);
    //id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,
    // healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,
    //smokes,smokesLow,smokesHigh
    var states = peopleData.map(data => data.state);
    var state_abbr = peopleData.map(data => data.abbr);
    console.log(`States: ${states}`);
    console.log(`State abbrev: ${state_abbr}`);
    
    peopleData.forEach(function(data) {
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

    });
    console.log(peopleData);
    var poverty = peopleData.map(data => data.poverty);
    
    var age = peopleData.map(data => data.age);
   
    var income = peopleData.map(data => data.income);
    
    var healthcare = peopleData.map(data => data.healthcare);
        
    var smokes = peopleData.map(data => data.smokes);
    
    var obesity = peopleData.map(data => data.obesity);
   
        
    console.log(`what is data here?`);
    console.log(peopleData);

    var xLinearScale = xScale(peopleData, chosenXAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(peopleData, d => d.obesity)])
        .range([chartHeight,0]);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft()
            .scale(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

   
    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(peopleData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr('value', d => d.abbr)
        .attr("r", 15)
        .attr("fill", "purple")
        .attr("opacity", "0.5")

    var textGroup = chartGroup.selectAll(".text")
        .data(peopleData)
        .enter()
        .append("text")
        .attr("class", "labelText")
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis])+5 )
        .attr('text-anchor', 'middle')
        .attr('stroke-width', '2px')
        .text(d => d.abbr);
       
    // Create group for multiple axis labels
    var labelsGroup = chartGroup.append("g")
                        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
        
    
    // y axis labels 
    var obesityLabel = labelsGroup.append("text")
        .attr("y", -chartWidth/2 - 60)
        .attr("x", chartHeight/2)
        .attr('text-anchor', 'middle')
        .attr("transform", "rotate(-90)")
        .attr("yValue", "obesity")  // value to grab for event listener
        .classed("active", true)
        .text("Obese (%)");

    var smokesLabel = labelsGroup.append("text")
        .attr("y", -chartWidth/2 - 45)                     //(chartHeight + 20))
        .attr("x", chartHeight/2)
        .attr('text-anchor', 'middle')
        .attr("transform", "rotate(-90)")
        .attr("yValue", "smokes")  // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var healthcareLabel = labelsGroup.append("text")
        .attr("y", -chartWidth/2- 30)
        .attr("x", chartHeight/2)
        .attr('text-anchor', 'middle')
        .attr("transform", "rotate(-90)")
        .attr("yValue", "healthcare")  // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    // x axis labels
    var povertyLabel = labelsGroup.append("text")
        .attr("y", -chartHeight/2 +150)
        .attr("x", chartWidth/2 - 250)
        .attr("xValue", "poverty")  // value to grab for event listener
        .classed("active", true)
        .text("In poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("y", -chartHeight/2 +165)
        .attr("x", chartWidth/2 - 250)
        .attr("xValue", "age")  // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
        .attr("y", -chartHeight/2 +180)
        .attr("x", chartWidth/2 - 250)
        .attr("xValue", "income")  // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");
    
        
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight - 20))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Data Journalism and D3");

    // updateToolTip function
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    
    labelsGroup.selectAll("text")
        .on("click", function() {
                        
            var xValue = d3.select(this).attr("xValue");
            console.log(`xValue: ${xValue}`);
            //console.log(data);
            if (xValue !== chosenXAxis && xValue != null) {
                chosenXAxis = xValue;

                //updates x scale for new data
                xLinearScale = xScale(peopleData, chosenXAxis);

                // updates x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);
               

                // // updates circles with new x values TBD
                // circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

                // // updates tooltips with new info TBD
                // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text  TBD
                if (chosenXAxis === "poverty") {
                    povertyLabel.classed("active", true)
                        .classed("inactive", false);
                    ageLabel.classed("active", false)
                        .classed("inactive", true);
                    incomeLabel.classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    povertyLabel.classed("active", false)
                        .classed("inactive", true);
                    ageLabel.classed("active", true)
                        .classed("inactive", false);
                    incomeLabel.classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "income" ) {
                    povertyLabel.classed("active", false)
                        .classed("inactive", true);
                    ageLabel.classed("active", false)
                        .classed("inactive", true);
                    incomeLabel.classed("active", true)
                        .classed("inactive", false);
                }

            }
            var yValue = d3.select(this).attr("yValue");
            console.log(`yValue selected: ${yValue}`);
            if ( yValue !== chosenYAxis && yValue != null) {
                chosenYAxis = yValue;

                // updates y scale for new data
                yLinearScale = yScale(peopleData, chosenYAxis);

                // update y axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // // update circles with y values 
                // circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                
                // // update tooltips with new info
                // circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                // changes ... to change bold text 
                if (chosenYAxis === "obesity") {
                    obesityLabel.classed("active", true)
                        .classed("inactive", false);
                    smokesLabel.classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel.classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "smokes") {
                    obesityLabel.classed("active", false)
                        .classed("inactive", true);
                    smokesLabel.classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel.classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "healthcare" ) {
                    obesityLabel.classed("active", false)
                        .classed("inactive", true);
                    smokesLabel.classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel.classed("active", true)
                        .classed("inactive", false);
                }

            }

            // updates circles with new x values 
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // // updates the text on the circles
            textGroup = updateTextGroup(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            
            // updates tooltips with new info 
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        });
}).catch(function(error) {
    console.log(error);
});


    
