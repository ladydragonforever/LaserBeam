// import htmlGenerator from "./test.js";
import {cnn, google, yahoo} from "./data";



// Data formatting into Nodes and Links
const transformData = (data) => (data.map(el => (
                    el.thirdparty.name
                    ))
                    );

const googleData = [...new Set(transformData(google))];

// google
const googleDataLinks = googleData.map(data=> ({
    source: "Google",
    target: data
}));

// cnn
const cnnData = [...new Set(transformData(cnn))];
const cnnDataLinks = cnnData.map(data => ({
    source: "CNN",
    target: data
}));

// yahoo
const yahooData = [...new Set(transformData(yahoo))];
const yahooDataLinks = yahooData.map(data => ({
    source: "Yahoo",
    target: data
}));

let inputNodes = {
    "Google": googleData,
    "CNN": cnnData,
    "Yahoo": yahooData,
}

let mergedNodes = {};


for(const group in inputNodes){
    inputNodes[group].forEach(name => {
        mergedNodes[name] = (mergedNodes[name] || []).concat([group])
    })
}

let mergedDataNodes = Object.keys(mergedNodes).map( key => {
    const value = mergedNodes[key];
    return {
        id: key,
        name: key,
        level: 2,
        groups: value
    }
});


console.log(mergedDataNodes);


const dataNodes = {
    nodes: [
         
        {
            id: "Google",
            name: "Google",
            level: 1
        },
        {
            id:"CNN",
            name: "CNN",
            level: 1
        },
        {
            id: "Yahoo",
            name: "Yahoo",
            level: 1
        },
        ...mergedDataNodes
        // ...googleDataNodes,
        // ...cnnDataNodes,
        // ...yahooDataNodes

      
    ],
    links: [
        ...googleDataLinks,
        ...cnnDataLinks,
        ...yahooDataLinks
   
    ]
    
}

// filter
const filterWidth = 500, filterHeight = 300;

const form = d3.select('#filter').append('form')
                .attr('width', filterWidth)
                .attr('height', filterHeight)

const companies = Object.keys(inputNodes);
const labels = form
    .attr('class', 'filter-form')
    .selectAll("label")
    .data(companies)
    .enter()
    .append("label").attr("id", function (d) { return d.replace(/ /g, '').replace(/,/g, "") + "ID"; })
    .text(function (d) { return d; })
    .append("input")
    .attr("type", "checkbox")
    .attr("checked", true)
    .attr('class', "checkbox")


// console.log(dataNodes)

function getNodeColor(node) {
    return node.level === 1 ? 'black' : "gray"
}

function getNodeSize(node) {
    return node.level === 1? "10" : "5"
}

function getLinkColor(link) {
    return randomItem(['green', 'blue', randomColor()]);
}

function getName(node) {
     return node.name
}

function getOpacity(node) {
    return node.level === 1 ? 1 : 1
}
// function getText(node) {
//     // console.log("getText", node);
//    return d3.select(this)
//         .transition()
//         .attr('opacity', .5);
// }
// const color = d3.scaleOrdinal(d3.schemeCategory10);
// Random color

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function randomColor() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    // return "rgb(" + x + "," + y + "," + z + ")";
    return `rgb(${x},${y},${z})`;
}

// create a bar chart
// to change the data
const dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

const svgWidth = 500, svgHeight = 300, barPadding = 5;
const barWidth = (svgWidth / dataset.length);


const svg1 = d3.select('#barChart').append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const barChart = svg1.append('g')
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function (d) {
        return svgHeight - d
    })
    .attr("height", function (d) {
        return d;
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
    });

//create a network graph
// need to add the links manually

const netWidth = 500, netHeight = 300; 

const links = dataNodes.links.map(d => Object.create(d));

console.log("links", links)

const nodes = dataNodes.nodes.map(d => Object.create(d));


const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-50))
    //.force("center", d3.forceCenter(netWidth/20, netHeight/20))
    .force("center", d3.forceCenter(netWidth/2, netHeight/2))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

const svg2 = d3.select('#network-graph').append('svg')
    // .attr('viewBox', [-netWidth/3, -netHeight/1.5, netWidth, netHeight])
    .attr('viewBox', [0, 0, netWidth, netHeight])

const link = svg2.append('g')
    //   .attr("stroke", "#999")
    //   .attr("stroke-opacity", 0.6)
    .selectAll("line")
      .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr('stroke', "gray")

    //   console.log("link", link)
// const node = svg2.selectAll('g')
//     .data(nodes)
//     .append('g')
//     .attr('transform', function(d){
//         return "translate("+d.x+".80"
//     })
// const circle = node.append("circle")
//     .attr("r", getNodeSize)
//     .attr('fill', getNodeColor)
// node.append("text")
//     .attr("dx", function(d){return -20})
//     .text(function(d){return d.name})
const node = svg2.append("g")
    .attr("class", "g_main")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
      .data(nodes)      
    .enter().append('circle')
      .attr("r", getNodeSize)
      .attr('fill', getNodeColor)
      .text("testing")
      
    // .on('click', function (d, i) {
    //     console.log("clicking on", this);
    //     // transition the clicked element
    //     // to have a radius of 20
    //     d3.select(this)
    //         .transition()
    //         .attr('r', 20);
    // })
    .on('mouseover', function (d, i) {
        const mouseNode = d3.select(this);
        // console.log("mousenode",mouseNode.parent)
        d3.selectAll("circle").style('opacity', getOpacity);
        d3.selectAll('text').style('opacity', d=> {
        
            return d.level===1 ? 1 : 0
        })
        mouseNode
            .transition()
            .text()
           
            .attr('opacity', 1);
    })
    .on('mouseout', function(d) {
        d3.selectAll("circle").style('opacity', 1);
        d3.selectAll('text').style('opacity', 0);
        d3.select(this)
            .transition()
           
            .attr('opacity', 1)
    })
    
    ;
   
const text = svg2.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .text(getName)
    .attr('font-size', 5)
    .attr('opacity', 0)
    .attr('dx', d => {
        return d.level === 1 ? -6 : 0
    })
    .attr('dy', 2)
    .attr('fill', 'green')
    // .on('click', function (d, i) {
    //     d3.select(this)
    //         .transition()
    //         .attr('r', 20);
    // })
    // .on('mouseover', function (d, i) {
    //     console.log(this);
    //     d3.select(this)
    //         .transition()
    //         .attr('opacity', 1);
    // })
    // .on('mouseout', function (d, i) {
    //     d3.select(this)
    //         .transition()
    //         .attr('opacity', 0);
    // });

    
let margin = 20;
function keepInBoxX(x, radius=0){
    if (x < 0 + margin)
        return 0 + margin;
    if (x > netWidth - margin)
        return netWidth - margin;
    return x
}

function keepInBoxY(y, radius=0){
    if (y < 0+ margin)
        return 0 + margin;
    if (y > netHeight - margin)
        return netHeight - margin;
    return y
}

simulation.on("tick", () => {
    link
        .attr("x1", d => keepInBoxX(d.source.x))
        .attr("y1", d => keepInBoxY(d.source.y))
        .attr("x2", d => keepInBoxX(d.target.x))
        .attr("y2", d => keepInBoxY(d.target.y));

    node
        // .attr("cx", function (d) {
        //     if(d.x < 0) 
        //         return 0;
        //     if(d.x > netWidth)
        //         return netWidth;
        //     return d.x

        //     console.log(d);
        //     return Math.max(radius, Math.min(netWidth - radius, d.x)); 
        // })
        // .attr("cy", function (d) { return d.y = Math.max(radius, Math.min(netHeight - radius, d.y)); })
        // .attr("cx", d => d.x)
        // .attr("cy", d => d.y)

        .attr("cx", d => keepInBoxX(d.x))
        .attr("cy", d => keepInBoxY(d.y))
       
    text
        .attr("x", node => node.x)
        .attr("y", node => node.y);    
});

// drag and drop
const dragDrop = d3.drag()
    .on('start', node => {
        node.fx = node.x
        node.fy = node.y
    })
    .on('drag', node => {
        simulation.alphaTarget(0.7).restart()
        node.fx = d3.event.x
        node.fy = d3.event.y
    })
    .on('end', node => {
        if (!d3.event.active) {
            simulation.alphaTarget(0)
        }
        node.fx = null
        node.fy = null
    })

node.call(dragDrop)

// highlight selection

function getNeighbors(node) {
    if (node.level === 1 ) {
        return links.reduce((neighbors, el) => {
            if (el.source.id === node.id) {
                neighbors.push(el.target.id)
            } 
            // console.log("neighbors", neighbors)
            return neighbors
            
        },[node.id])


    }
}

function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
}

function getHighlightNodeColor(node, neighbors){
    if(node.id == neighbors[0]){
        return 'red';
    }
   
    if(neighbors.indexOf(node.id) !== -1) {
        return "red"
    } else {
        return "gray"
    }
    
   
}

function getHightlightLinkColor(node, link) {
    return isNeighborLink(node, link) ? "red" : "gray"
}

function selectNode(selectedNode) {
    d3.select(this)
    .transition()
    .attr('fill', "red")

    // const neighborNodes = node.filter( node => getNeighbors(selectedNode).includes(node.id));
    const neighbors = getNeighbors(selectedNode)
    

    node
    .transition()
    .attr('fill', d => getHighlightNodeColor(d, neighbors))

    link
    .attr('stroke', d=> getHightlightLinkColor(selectedNode, d))
}

node.on('click', selectNode)

