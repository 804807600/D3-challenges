// @TODO: YOUR CODE HERE!
var data = d3.csv("assets/data/data.csv")

var svgWidth = 700
var svgHeight = 500

var chartMargin = {
    top: 100,
    right: 30,
    bottom:100,
    left: 100
}
var chartWidth = svgWidth - chartMargin.left - chartMargin.right
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`)

var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"

function xscale(data, chosenXAxis) {
    var XScale = d3.scaleLinear()
        .domain([d3.min(data, data => data[chosenXAxis]) * 0.8, d3.max(data, data => data[chosenXAxis]) * 1.2])
        .range([0, chartWidth])
    return XScale
}
function yscale(data, chosenYAxis) {
    var YScale = d3.scaleLinear()
        .domain([d3.min(data, data => data[chosenYAxis]) * 0.8, d3.max(data, data => data[chosenYAxis]) * 1.2])
        .range([chartHeight,0])
    return YScale
}

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale)
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)
    return xAxis
}
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale)
    yAxis.transition()
        .duration(1000)
        .call(leftAxis)
    return yAxis
}

function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis,  chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]))

    return circlesGroup
}
function renderCirclesText(circlesText, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    circlesText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis] - 0.2))
        .attr("y", d => newYScale(d[chosenYAxis] - 0.2))
    return circlesText
}
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesText) {
    if (chosenXAxis === "poverty") {
        var xlabel = "In Poverty %"
    }
    else if (chosenYAxis === "age") {
        var xlabel = "Age(Median)"
    }
    else {
        var xlabel = "Househould Income(Median)"
    }
    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare(%)"
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes(%)"
    }
    else {
        var ylabel = "obesity(%)"
    }
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -80])
        .html(function (d) {
            return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`)
        })
    circlesGroup.call(toolTip)
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data)
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data)
        })
    circlesText.call(toolTip)
    circlesText.on("mouseover", function (data) {
        toolTip.show(data)
    })
        .on("mouseout", function (data, index) {
            toolTip.hide(data)
        })
    return circlesGroup
}



data.then(function (data) {
    data.forEach(d => {

        d.poverty = +d.poverty;
        d.age = +d.age;
        d.healthcare = +d.healthcare;
        d.smokes = +d.smokes
        d.income = +d.income
        d.obesity = +d.obesity


    })
    var XScale = xscale(data, chosenXAxis)
    var YScale = yscale(data, chosenYAxis)
    var bottomAxis = d3.axisBottom(XScale)
    var leftAxis = d3.axisLeft(YScale)
    var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(bottomAxis)
    var yAxis = chartGroup.append("g")
    .call(leftAxis)
    var circlesGroup = chartGroup.selectAll(".scatter")
        .data(data)
        .enter()
        .append("circle")
        .classed("scatter", true)
        .attr("cx", d => XScale(d[chosenXAxis]))

        .attr("cy", d => YScale(d[chosenYAxis]))
        .attr("r", "7")
        .attr("opacity", ".7")
        .attr("fill", "#89bdd3")
    var circlesText = chartGroup.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .classed("text", true)
        .attr("x", d => XScale(d[chosenXAxis] - 0.2))
        .attr("y", d => YScale(d[chosenYAxis] - 0.2))
        .text(d => d.abbr)
        .attr("font-size", "7px")
        .attr("fill", "white")

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
    var healthcarelabel = ylabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left+10)
        .attr("x", 0 - (chartHeight / 2))
        .text("Lacks Healthcare(%)")
        .attr("dy", "1.5em")
        .attr("value","healthcare")
        .classed("active",true)
    var smokeslabel = ylabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left+30)
        .attr("x", 0 - (chartHeight / 2))
        .text("Smokes(%)")
        .attr("dy", "1.5em")
        .attr("value","smokes")
        .classed("inactive",true)
    var obesitylabel = ylabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left+50)
        .attr("x", 0 - (chartHeight / 2))
        .text("obesity(%)")
        .attr("dy", "1.5em")
        .attr("value","obesity")
        .classed("inactive",true)
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeight})`)

    var povertylabel = xlabelsGroup.append("text")
        .attr("dy", "2em")
        .attr("dx", chartWidth / 2 - 20)
        .attr("value","poverty")
        .classed("active",true)
        .text("In Poverty %")
    var agelabel = xlabelsGroup.append("text")
        .attr("dy", "3em")
        .attr("dx", chartWidth / 2 - 20)
        .attr("value","age")
        .classed("inactive",true)
        .text("Age(Median)")
    var incomelabel = xlabelsGroup.append("text")
        .attr("dy", "4em")
        .attr("dx", chartWidth / 2 - 20)
        .attr("value","income")
        .classed("inactive",true)
        .text("Income(Median) %")
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesText)

    xlabelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value")
            if (value !== chosenXAxis) {
                chosenXAxis = value
                XScale = xscale(data, chosenXAxis)
                xAxis = renderXAxis(XScale, xAxis)
                circlesGroup = renderCircles(circlesGroup, XScale, YScale, chosenXAxis, chosenYAxis)
                circlesText = renderCirclesText(circlesText, XScale, YScale, chosenXAxis, chosenYAxis)
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesText)

                if (chosenXAxis === "poverty") {
                    povertylabel
                        .classed("active", true)
                        .classed("inactive", false);
                    agelabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomelabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    agelabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomelabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertylabel
                        .classed("active", false)
                        .classed("inactive", true);
                    agelabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomelabel
                        .classed("active", true)
                        .classed("inactive", false);

                }

            }
        })
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            var value = d3.select(this).attr("value")
            if (value !== chosenYAxis) {
                chosenYAxis = value
                YScale = yscale(data, chosenYAxis)
                yAxis = renderYAxis(YScale, yAxis)
                circlesGroup = renderCircles(circlesGroup, XScale, YScale, chosenXAxis, chosenYAxis)
                circlesText = renderCirclesText(circlesText, XScale, YScale, chosenXAxis, chosenYAxis)
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, circlesText)

                if (chosenYAxis === "healthcare") {
                    healthcarelabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeslabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesitylabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    healthcarelabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeslabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesitylabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcarelabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeslabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesitylabel
                        .classed("active", true)
                        .classed("inactive", false);

                }

            }
        })

}
)


    .catch(function (error) {
        console.log(error)
    })


