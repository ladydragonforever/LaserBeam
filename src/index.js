// import htmlGenerator from "./test.js";
import { cnn, google, yahoo, Twitter, CBSSports, facebook, amazon, nyTimes, youtube, appacademy} from "./data";


//helper functions 
function getNodeColor(node) {
    return node.level === 1 ? 'black' : "gray"
}

function getNodeSize(node) {
    return node.level === 1 ? "20" : "5"
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

// twitter
const twitterData = [...new Set(transformData(Twitter))];

const twitterDataLinks = twitterData.map(data => ({
    source: "TwitterHost",
    target: data
}));

// CBSSports

const CBSData = [...new Set(transformData(CBSSports))];
const CBSDataLinks = CBSData.map(data => ({
    source: "CBS",
    target: data
}));

// Facebook
const FacebookData = [...new Set(transformData(facebook))];
const FacebookDataLinks = FacebookData.map(data => ({
    source: "FacebookHost",
    target: data
}));
// console.log(FacebookDataLinks)

// Amazon
const amazonData = [...new Set(transformData(amazon))];
const amazonDataLinks = amazonData.map(data => ({
    source: "AmazonHost",
    target: data
}));

// NYTimes
const NYData = [...new Set(transformData(nyTimes))];
const NYDataLinks = NYData.map(data => ({
    source: "NYHost",
    target: data
}));

// youtube
const youtubeData = [...new Set(transformData(youtube))];
const youtubeDataLinks = youtubeData.map(data => ({
    source: "YoutubeHost",
    target: data
}));

// appacademy
const appacademyData = [...new Set(transformData(appacademy))];
const appacademyDataLinks = appacademyData.map(data => ({
    source: "AppAcademyHost",
    target: data
}));


let inputNodes = {
    "Google": googleData,
    "CNN": cnnData,
    "Yahoo": yahooData,
    "Twitter": twitterData,
    "CBS": CBSData,
    "Facebook": FacebookData,
    "Amazon": amazonData,
    "NYTimes": NYData,
    "Youtube": youtubeData,
    "AppAcademy": appacademyData
}

// console.log(twitterData, twitterDataLinks)
// console.log(yahooData, yahooDataLinks)
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
    // console.log(selectButton[0].value)
    let newVisibility = selectButton[0].value === "Unselect" ? "visible" : "hidden"
    d3.selectAll("line").attr("visibility", function(d) {if (d.source) return newVisibility})
    d3.selectAll("circle").attr("visibility", d => {return newVisibility})
    d3.selectAll('text').attr('visibility', d=> {if (d && d.level) return newVisibility})     
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
                if (d.source === undefined) return d3.select(this).attr("visibility");
                if (d.source.name === company) {
                    return newVisibility;
                } else {
                    return d3.select(this).attr("visibility")
                }
            });        
        d3.selectAll("text").attr("visibility",

            function (d) {
                if (d === undefined || d.groups === undefined) return d3.select(this).attr("visibility");
                if (d.groups.includes(company)) {
                    return newVisibility;
                } else {
                    return d3.select(this).attr("visibility")
                }
            }); 
        d3.selectAll("circle").attr("visibility",
            function (d) {
                if (d.groups === undefined) return d3.select(this).attr("visibility");
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
        {
            id: "TwitterHost",
            name: "Twitter",
            level: 1,
            groups: ["Twitter"]
        },
        {
            id: "CBS",
            name: "CBS",
            level: 1,
            groups: ["CBS"]
        },
        {
            id: "FacebookHost",
            name: "Facebook",
            level: 1,
            groups: ["Facebook"]
        }, 
        {
            id: "AmazonHost",
            name: "Amazon",
            level: 1,
            groups: ["Amazon"]
        }, 
        {
            id: "NYHost",
            name: "NYTimes",
            level: 1,
            groups: ["NYTimes"]
        },  
        {
            id: "YoutubeHost",
            name: "Youtube",
            level: 1,
            groups: ["Youtube"]
        }, 
        {
            id: "AppAcademyHost",
            name: "AppAcademy",
            level: 1,
            groups: ["AppAcademy"]
        },
        ...mergedDataNodes

    ],
    links: [
        ...googleDataLinks,
        ...cnnDataLinks,
        ...yahooDataLinks,
        ...twitterDataLinks,
        ...CBSDataLinks,
        ...FacebookDataLinks,
        ...amazonDataLinks,
        ...NYDataLinks,
        ...youtubeDataLinks,
        ...appacademyDataLinks
   
    ]
    
}

// create a bar chart
const googleTrackers = googleDataLinks.length;
const cnnTrackers = cnnDataLinks.length;
const yahooTrackers = yahooDataLinks.length;
const twitterTrackers = twitterDataLinks.length;
const CBSTrackers = CBSDataLinks.length;
const FacebookTrackers = FacebookDataLinks.length;
const amazonTrackers = amazonDataLinks.length;
const NYTrackers = NYDataLinks.length;
const youtubeTrackers = youtubeDataLinks.length;
const appacademyTrackers = appacademyDataLinks.length;

const sample = [ 
                    {
                        Company: "Google",
                        Number: googleTrackers
                    }, 
                    {
                        Company: "CNN",
                        Number: cnnTrackers
                    },
                    {
                        Company: "Yahoo",
                        Number: yahooTrackers
                    },
                    {
                        Company: "Twitter",
                        Number: twitterTrackers
                    },
                    {
                        Company: "CBS",
                        Number: CBSTrackers
                    },
                    {
                        Company: "Facebook",
                        Number: FacebookTrackers
                    },
                    {
                        Company: "Amazon",
                        Number: amazonTrackers,
                    },
                    {
                        Company: "NYTimes",
                        Number: NYTrackers
                    },
                    {
                        Company: "Youtube",
                        Number: youtubeTrackers
                    },
                    {
                        Company: "AppAcademy",
                        Number: appacademyTrackers
                    }
];

const svg = d3.select('svg');
const svgContainer = d3.select('#container');

const margin = 80;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .domain(sample.map((s) => s.Company))
    .padding(0.4)

const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 120]);

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

const makeYLines = () => d3.axisLeft()
    .scale(yScale)

chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

chart.append('g')
    .call(d3.axisLeft(yScale));

chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
    )

const barGroups = chart.selectAll()
    .data(sample)
    .enter()
    .append('g')

barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.Company))
    .attr('y', (g) => yScale(g.Number))
    .attr('height', (g) => height - yScale(g.Number))
    .attr('width', xScale.bandwidth())
    .on('mouseenter', function (actual, i) {
        d3.selectAll('.Number')
            .attr('opacity', 0)

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)
            .attr('x', (a) => xScale(a.Company) - 5)
            .attr('width', xScale.bandwidth() + 10)

        const y = yScale(actual.Number)

        const line = chart.append('line')
            .attr('id', 'limit')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)

        barGroups.append('text')
            .attr('class', 'divergence')
            .attr('x', (a) => xScale(a.Company) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.Number) + 30)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
          

    })
    .on('mouseleave', function () {
        d3.selectAll('.value')
            .attr('opacity', 1)

        d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('x', (a) => xScale(a.Company))
            .attr('width', xScale.bandwidth())

        chart.selectAll('#limit').remove()
        chart.selectAll('.divergence').remove()
    })

barGroups
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.Company) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.Number) - 2)
    .attr('text-anchor', 'middle')
    .text((a) => a.Number)

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Number of trackers')

svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Websites')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Third-party tracker numbers on popular websites (Hover on the Bar)')

svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')
    .text('Source: PrivacyEye & Request Map')



//create a network graph

const netWidth = 500, netHeight = 400; 

const links = dataNodes.links.map(d => Object.create(d));

// console.log("links", links)

const nodes = dataNodes.nodes.map(d => Object.create(d));


const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-60))
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
        
    //         return d.name=== mouseNode.name ? 1 : 0
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
    .attr('font-weight', 600)
    .attr('opacity', function (d, i) {
            return d.level === 1 ? 1 : 0
    }) 
    .attr('dx', d => {
        return d.level === 1 ? -8 : 6
    })
    .attr('dy', 2)
    .attr('fill', 'red')
    // .on('mouseover', function (d, i) {
    //    attr('opacity', 1)
    //     })

    
let margin1 = 20;
function keepInBoxX(x, radius=0){
    if (x < 0 + margin1)
        return 0 + margin1;
    if (x > netWidth - margin1)
        return netWidth - margin1;
    return x
}

function keepInBoxY(y, radius=0){
    if (y < 0+ margin1)
        return 0 + margin1;
    if (y > netHeight - margin1)
        return netHeight - margin1;
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
        .attr("x", node => keepInBoxX(node.x))
        .attr("y", node => keepInBoxY(node.y));    
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
    if (neighbors === undefined) return "gray";
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
    if (neighbors === undefined) return 0.5;
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
    if (node.level === 1 ) {
        return 1;
    }
    if (neighbors === undefined) return 0;
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

}
function selectText(selectedNode) {
      
    const neighbors = getNeighbors(selectedNode)

    text
    .transition()
    .attr('opacity', d=> getHighlightTextOpacity(d, neighbors))
}

node
.on('click', selectNode)
// .on('mouseover', selectText)
// .on('mouseout', function (d, i) {
//         const mouseNode = d3.select(this);

//         d3.selectAll('text').attr('opacity', d=> {
//             if (d===undefined) return 1;
//             return d.level===1 || d.level === undefined ? 1 : 0
//         })

//     })
