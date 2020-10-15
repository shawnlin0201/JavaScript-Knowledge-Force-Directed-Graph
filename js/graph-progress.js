const width = document.querySelector('.graph-wrapper').offsetWidth;
const height = document.querySelector('.graph-wrapper').offsetHeight;

const links = data.links.map(d => Object.create(d));
const nodes = data.nodes.map(d => Object.create(d));

const color = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3.select(".graph-wrapper").append("svg")
    .attr("width", width)
    .attr("height", height)

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).iterations(5).strength(1).id(d => d.id).distance(d => d.distance ))
    .force("charge", d3.forceManyBody().strength(-300).distanceMax(500))
    .force("center", d3.forceCenter(width / 2, height / 2))

const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.5)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => d.value + 1);

const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("g")
    .attr("class", "node-group")
    .on("click", function(d){
        document.querySelector('.lightbox-wrapper').classList.add('is-active')
        renderWebsiteList(d.text)
    })
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))

const circle = node.append("circle")
    .attr("r", d => (d.important / 10) * 4 + 3)
    .attr("fill", d => color(d.group))

const title = node.append("title")
    .text(d => d.title)

const text = node.append("text")
    .text(d => d.text)
    .style("fill", "black")
    .style("stroke", "none")
    .style("transform", "translate(10px, 5px)")
    .style("font-family", "微軟正黑體")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .attr("class", "name")

simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`)
});

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function getTagListTemplate(target) {
    var template = ''

    target.forEach(tag => {
        template += `<li class="tag-item">${tag}</li>`
    })

    return `
        <ul class="tags-list">相關標籤：
            ${template}
        </ul>
    `
}

function getWebsiteListTemplate(keyword){
    var template = ''
    console.log('keyword', keyword)
    collectionWebsite
        .filter(Website => Website.tag.indexOf(keyword) > -1)
        .forEach(Website => {

            template += `
        <li class="website-item">
            <p class="author">作者：${Website.author}</p>
            <p class="indtroduction">內容：${Website.intro}</p>
            ${getTagListTemplate(Website.tag)}
            
            <p class="btn-enter"><a class="item-link" href="${Website.url}" target="_blank">前往網站</a></p>
        </li>
        `
    })

    return `
        <li class="search-title">有關於「 ${keyword} 」的搜尋網站</li>
        ${template}
    `
}

function renderWebsiteList (keyword){
    document.querySelector('.website-list').innerHTML = getWebsiteListTemplate(keyword)
}