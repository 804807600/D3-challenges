// @TODO: YOUR CODE HERE!
var data=d3.csv("assets/data/data.csv")

console.log(data)
var svgWidth=600
var svgHeight=400

var chartMargin={
    top:30,
    right:30,
    bottom:50,
    left:50
}
var chartWidth=svgWidth-chartMargin.left-chartMargin.right
var chartHeight=svgHeight-chartMargin.top-chartMargin.bottom
var svg= d3.select("#scatter")
            .append("svg")
            .attr("height",svgHeight)
            .attr("width",svgWidth)
var chartGroup=svg.append("g")
                .attr("transform",`translate(${chartMargin.left},${chartMargin.top})`)

data.then(function(data)
{
    data.forEach(d=>{
        
        d.poverty= +d.poverty; 
        d.age= +d.age;
        d.healthcare= +d.healthcare;
        d.smokes= +d.smokes

        
    })
    
    var XScale=d3.scaleLinear()
        .domain([d3.min(data,data=>data.poverty)*0.8,d3.max(data,data=>data.poverty)*1.2])
        .range([0,chartWidth])
    var YScale=d3.scaleLinear()
        .domain([d3.min(data,data=>data.healthcare)*0.8,d3.max(data,data=>data.healthcare)*1.2])
        .range([chartHeight,0])
    var bottomAxis=d3.axisBottom(XScale)
    var leftAxis=d3.axisLeft(YScale)
    
    chartGroup.append("g")
            .attr("transform",`translate(0,${chartHeight})`)
            .call(bottomAxis)
    chartGroup.append("g")
            .call(leftAxis)
    chartGroup.selectAll(".scatter")
            .data(data)
            .enter()
            .append("circle")
            .classed("scatter",true)
            .attr("cx",d=>XScale(d.poverty))
        
            .attr("cy",d=>YScale(d.healthcare))
            .attr("r","7")
            .attr("opacity",".7")
            .attr("fill","#89bdd3")
    chartGroup.selectAll(".text")
            .data(data)
            .enter()
            .append("text")
            .classed("text",true)
            .attr("x",d=>XScale(d.poverty-0.2))
            .attr("y",d=>YScale(d.healthcare-0.2))
            .text(d=>d.abbr)
            .attr("font-size","7px")
            .attr("fill","white")
    chartGroup.append("text")
                .attr("transform","rotate(-90)")
                .attr("y",0-chartMargin.left)
                
                .attr("x",0-(svgHeight/2))
                .text("Lacks Healthcare(%)")
                .attr("dy","1.5em")
    chartGroup.append("text")
                .attr("transform",`translate(0,${chartHeight})`)
                .attr("dy","2em")
                .attr("dx",chartWidth/2-20)
                .text("Poverty %")
                
              


}).catch(function(error) {
    console.log(error)})