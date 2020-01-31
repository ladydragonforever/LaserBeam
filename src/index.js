// import htmlGenerator from "./test.js";
import {cnn, google, yahoo} from "./data";


//helper functions 
function getNodeColor(node) {
    return node.level === 1 ? 'black' : "gray"
}

function getNodeSize(node) {
    return node.level === 1 ? "10" : "5"
}

function getName(node) {
    return node.name
}

function getOpacity(node) {
    return node.level === 1 ? 1 : 1
}


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
const companies = Object.keys(inputNodes);

// filter

// D3 for creating form with checkboxes

// const filterWidth = 500, filterHeight = 300;

// const form = d3.select('#filter').append('form')
//                 .attr('width', filterWidth)
//                 .attr('height', filterHeight)

// const labels = form
//     .attr('class', 'filter-form')
//     .selectAll("label")
//     .data(companies)
//     .enter()
//     .append("label")
//     .text(function (d) { return d; })
//     .append("input").attr("id", function (d) { return d.replace(/ /g, '').replace(/,/g, ""); })
//     .attr("type", "checkbox")
//     .attr("checked", true)
//     .attr('class', "checkbox")

// vanilla js for creating form with checkboxes
const formTag = document.createElement("form")
formTag.setAttribute("class", 'filter-form')

for (let i = 0; i < companies.length; i++) {
    const idName = companies[i];
    const labelTag = document.createElement('label');
    labelTag.innerText = idName;
    formTag.appendChild(labelTag);
    const inputTag = document.createElement('input');
    inputTag.setAttribute('type', "checkbox");
    inputTag.setAttribute('id', idName);
    inputTag.setAttribute('class', "checkboxes")
    inputTag.setAttribute('checked', true);
    labelTag.appendChild(inputTag);
}

const form = document.getElementById('filter').appendChild(formTag)
    
// vanilla js for selecting and unselecting all
const selectButton = document.getElementsByClassName('select-all')
const selectAllFilter = () => {
    if (selectButton[0].value === "Select All") {
        for (const company of companies) {
            document.getElementById(`${company}`).checked = true;
        }
        selectButton[0].value = "Unselect";

    } else {
        for (const company of companies) {
            document.getElementById(`${company}`).checked = false;
        }
        selectButton[0].value = "Select All";
    }
}
const updateAll = () => {
    console.log(selectButton[0].value)
    let newVisibility = selectButton[0].value === "Unselect" ? "visible" : "hidden"
    d3.selectAll("line").attr("visibility", function(d) {return newVisibility})
    d3.selectAll("circle").attr("visibility", d => {return newVisibility})
    d3.selectAll('text').attr('visibility', d=> {return newVisibility})     
}
// add eventlistner for the selectAll button
selectButton[0].addEventListener('click', selectAllFilter)
selectButton[0].addEventListener('click', updateAll)
// add evenlistner for each checkbox
const checkboxes = document.getElementsByClassName("checkboxes")

const updateData = (company) => {
    // console.log(company)
        let newVisibility = document.getElementById(company).checked ? "visible" : "hidden";
    
        d3.selectAll("line").attr("visibility",
        
            function (d) {
                if (d.source.name === company) {
                    return newVisibility;
                } else {
                    return d3.select(this).attr("visibility")
                }
            });        
        d3.selectAll("text").attr("visibility",

            function (d) {
                if (d.groups.includes(company)) {
                    return newVisibility;
                } else {
                    return d3.select(this).attr("visibility")
                }
            }); 
        d3.selectAll("circle").attr("visibility",
            function (d) {
                if (!d.groups.includes(company)) { 
                    return d3.select(this).attr("visibility"); 
                } else {    
                    return newVisibility;
                }
            });
}

for (const checkbox of checkboxes) {
    checkbox.addEventListener('change', ()=>updateData(checkbox.id))
    
}



// console.log(filteredInput)
    // 
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

const dataNodes = {
    nodes: [
         
        {
            id: "Google",
            name: "Google",
            level: 1,
            groups: ["Google"]
        },
        {
            id:"CNN",
            name: "CNN",
            level: 1,
            groups: ["CNN"]
        },
        {
            id: "Yahoo",
            name: "Yahoo",
            level: 1,
            groups: ["Yahoo"]
        },
        ...mergedDataNodes

    ],
    links: [
        ...googleDataLinks,
        ...cnnDataLinks,
        ...yahooDataLinks
   
    ]
    
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

// console.log("links", links)

const nodes = dataNodes.nodes.map(d => Object.create(d));


const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(netWidth/2, netHeight/2))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

const svg2 = d3.select('#network-graph').append('svg')
    .attr('viewBox', [0, 0, netWidth, netHeight])


const link = svg2.append('g')
    .selectAll("line")
    .data(links)
    .join("line")
    .attr('opacity', 0.5)
    .attr("stroke-width", d => Math.sqrt(d.value))
    .attr('stroke', "gray")

const node = svg2.append("g")
    .attr("class", "g_main")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
      .data(nodes)      
    .enter().append('circle')
      .attr("r", getNodeSize)
      .attr('fill', getNodeColor)
      .attr('opacity', 0.5)
      
    // .on('mouseover', function (d, i) {
    //     const mouseNode = d3.select(this);
       
    //     d3.selectAll('text').attr('opacity', d=> {
        
    //         return d.level===1 ? 1 : 0
    //     })
       
    // })
    // .on('mouseout', function(d) {
      
    //     d3.selectAll('text').attr('opacity', 0);
    //     d3.select(this)
    //         .transition()

    // });


   
const text = svg2.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .text(getName)
    .attr('font-size', 5)
    .attr('opacity', function (d, i) {
            return d.level === 1 ? 1 : 0
    }) 
    .attr('dx', d => {
        return d.level === 1 ? -6 : 6
    })
    .attr('dy', 2)
    .attr('fill', 'red')

    
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
            return neighbors
            
        },[node.id])


    }
}

function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
}


function getHighlightNodeColor(node, neighbors){
    if(node.id == neighbors[0]){
        return '#0ff';
    }
   
    if(neighbors.indexOf(node.id) !== -1) {
        return "#0ff"
    } else {
        return "gray"
    }
    
   
}

function getHighlightNodeOpacity(node, neighbors) {
    if (node.id == neighbors[0]) {
        return 1;
    }

    if (neighbors.indexOf(node.id) !== -1) {
        return 1
    } else {
        return 0.5
    }


}
function getHighlightTextOpacity(node, neighbors) {
    if (node.level === 1) {
        return 1;
    }

    if (neighbors.indexOf(node.id) !== -1) {
        return 1
    } else {
        return 0
    }


}

function getHightlightLinkColor(node, link) {
    return isNeighborLink(node, link) ? "#0ff" : "gray"
}

function getHighlightLinkOpacity(node, link) {
    return isNeighborLink(node, link) ? 1 : 0.5
}

function selectNode(selectedNode) {
    d3.select(this)
    .transition()
        .attr('fill', "#0ff")
    const neighbors = getNeighbors(selectedNode)
    

    node
    .transition()
    .attr('fill', d => getHighlightNodeColor(d, neighbors))
    .attr('opacity', d => getHighlightNodeOpacity(d, neighbors))

    

    link
    .transition()
    .attr('stroke', d=> getHightlightLinkColor(selectedNode, d))
    .attr('opacity', d=> getHighlightLinkOpacity(selectedNode, d))

    text
    .transition()
    .attr('opacity', d=> getHighlightTextOpacity(d, neighbors))
}

node.on('click', selectNode)

