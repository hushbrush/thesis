<template>
  <div class="scrolly-container">
    <div class="background-layer" :class="'bg-step-' + currentStep"></div>

    <div class="graphic" ref="chart"></div>

    <div class="steps">
      <div class="step" data-step="0">Archetypes</div>
      <div class="step" data-step="1">Geography</div>
      <div class="step" data-step="2">Time</div>

    </div>
    <!-- At the end of the timeline layout component -->
<button @click="$emit('show-card')" class="character-card-button">
  View Character Details
</button>



    <div class="tooltip" ref="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import scrollama from 'scrollama'
import data from '@/assets/data.json'
import { computeClusterCentersBySize } from '@/utils/clusterSorter.js'

export default {
  name: 'ScrollStage',
  data() {
    return {
      nodes: data,
      width: window.innerWidth,
      height: window.innerHeight,
      currentStep: 0,
      svg: null,
      tooltip: null,
      simulation: null,
      node: null,
      clusterMeta: [
        { name: "Devoted", color: "#DBF39D" },
        { name: "Wild Ones", color: "#caf244" },
        { name: "Queens", color: "#b17fe3" },
        { name: "Lovers", color: "#ff94d6" },
        { name: "Hearthkeepers", color: "#F9C74F" },
        { name: "Outcasts", color: "#9D4EDD" },
        { name: "Furies", color: "#f56c0a" },
        { name: "Protectors", color: "#7face3" }
      ]
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.chart)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    this.tooltip = this.$refs.tooltip

    this.drawInitialNodes()
    this.setupScrollama()
  },
  methods: {
    ticked() {
  this.node
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
},

  drawInitialNodes() {
    // Create labels & circles
    this.createLabels()
    this.createNodes()
    this.bindTooltip()
    

    // Init simulation
    this.createSimulation()
  },

  createLabels() {
    const clusterCenters = computeClusterCentersBySize(this.nodes, this.width, this.height, 210)
    this.svg.selectAll('text.cluster-label').remove()

    this.svg.selectAll('text.cluster-label')
      .data(clusterCenters)
      .enter()
      .append('text')
      .attr('class', 'cluster-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y - 200)
      .attr('text-anchor', 'middle')
      .attr('fill', (d, i) => this.clusterMeta?.[i]?.color || 'white')
      .attr('font-size', 18)
      .text((d, i) => this.clusterMeta?.[i]?.name || `Cluster ${i}`)
  },

  createNodes() {
    this.node = this.svg.selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr("r", 10)
      .attr('fill', d => this.clusterMeta?.[d.archetype]?.color || 'white')
      .attr('opacity', 0.9)
  },

  bindTooltip() {
    const tooltip =  this.$refs.tooltip
    this.node
      .on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2)
        tooltip.style.display = 'block'
        tooltip.innerHTML = `
  <div style="font-weight: bold; font-size: 20px; margin-bottom: 6px;">
    ${d.character}
  </div>
  <div style="font-size: 14px; opacity: 0.8;">Archetype: ${d.archetype}</div>
  <div style="margin-bottom: 6px;">${d.bio}</div>
  <div style="font-style: italic; margin-bottom: 6px;">${d.title}</div>
  
`

      })
      .on('mousemove', function (event) {
        tooltip.style.left = `${event.pageX + 12}px`
        tooltip.style.top = `${event.pageY - 30}px`
      })
      .on('mouseout', function () {
        d3.select(this).attr('stroke', null)
        tooltip.style.display = 'none'
      })
  },

  createSimulation() {
    const ticked = () => {
      this.node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }

    this.simulation = d3.forceSimulation(this.nodes)
      .force('x', d3.forceX().strength(0.7))
      .force('y', d3.forceY().strength(0.7))
      .force('collision', d3.forceCollide(10))
      .force('charge', d3.forceManyBody().strength(-10))
      .alphaDecay(0.02)
      .velocityDecay(0.5)
      .on('tick', this.ticked)
  },

  setupScrollama() {
    const scroller = scrollama()
    scroller
      .setup({
        step: '.step',
        offset: 0.7,
        debug: false
      })
      .onStepEnter(({ index }) => {
        this.currentStep = index
        this.updateLayout(index)
      })
  },

  updateLayout(index) {
    if (index === 0) this.drawClusterLayout()
    if (index === 1) this.drawMapLayout()
    if (index === 2) this.drawTimelineLayout()
  },

  drawClusterLayout() {
    const clusterCenters = computeClusterCentersBySize(this.nodes, this.width, this.height, 210)
    this.createLabels()

    this.simulation
      .force('x', d3.forceX(d => clusterCenters[d.archetype]?.x).strength(0.7))
      .force('y', d3.forceY(d => clusterCenters[d.archetype]?.y).strength(0.7))
      .alpha(1)
      .restart()
      .on('tick', this.ticked)
  },

  drawMapLayout() {
    
    this.svg.selectAll('text.cluster-label').remove()

    const projection = d3.geoMercator()
      .center([0, 20])
      .scale(this.width / 6.5)
      .translate([this.width / 2, this.height / 2])

    this.simulation
      .force('x', d3.forceX(d => {
        const coords = projection([d.lon, d.lat])
        return coords ? coords[0] : this.width / 2
      }).strength(0.8))
      .force('y', d3.forceY(d => {
        const coords = projection([d.lon, d.lat])
        return coords ? coords[1] : this.height / 2
      }).strength(0.8))
      .alpha(1)
      .restart()
      .on('tick', this.ticked)
  },
  drawTimelineLayout() {
  this.simulation.stop()
  this.svg.selectAll('text').remove()
  this.svg.selectAll('.uncertainty').remove()
  this.svg.selectAll('line').remove()
  this.svg.selectAll('g').remove()

  const timeExtent = d3.extent(this.nodes, d => +d.original_date || 0)
  const xScale = d3.scaleLinear()
    .domain([timeExtent[0] - 100, timeExtent[1] + 100])
    .range([100, this.width - 100])

  const xAxis = d3.axisBottom(xScale).tickFormat(d => d)
  this.svg.append("g")
    .attr("transform", `translate(0, ${this.height - 40})`)
    .call(xAxis)
    .selectAll("text")
    .style("fill", "white")

  this.svg.append("line")
    .attr("x1", xScale(0))
    .attr("x2", xScale(0))
    .attr("y1", 0)
    .attr("y2", this.height)
    .attr("stroke", "white")
    .attr("stroke-width", 1)

  this.svg.append("text")
    .attr("x", xScale(0) + 8)
    .attr("y", 20)
    .text("Birth of Christ")
    .style("fill", "white")
    .style("font-size", "12px")

  // Group by archetype
  const grouped = d3.rollup(
    this.nodes,
    v => v,
    d => d.archetype
  )
  const sortedGroups = Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])
  const stackMap = new Map()
  const nodePositions = []
const spacing = 10
const baseY = this.height - 80 // stack from bottom

for (const [archetype, group] of sortedGroups) {
  const color = this.clusterMeta[archetype]?.color || '#888'

  for (const d of group) {
    const x = xScale(d.original_date)

    // How many characters already placed at this x/date?
    const count = stackMap.get(x) || 0
    const y = baseY - count * spacing

    stackMap.set(x, count + 1) // Update stack

    nodePositions.push({ ...d, x, y })

    this.svg.append("rect")
      .attr("class", "uncertainty")
      .attr("x", xScale(d.original_date - d.date_range_confidence))
      .attr("y", y - 10)
      .attr("width", xScale(d.original_date + d.date_range_confidence) - xScale(d.original_date - d.date_range_confidence))
      .attr("height", 18)
      .attr("fill", color)
      .attr("opacity", 0.1)
      .attr("rx", 10)
  }
}

  // Transition circles to new layout
  this.node
    .data(nodePositions, d => d.character) // make sure binding stays correct
    .transition()
    .duration(1000)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
}


}

}
</script>


<style scoped>
.scrolly-container {
  position: relative;
  display: flex;
  flex-direction: column; /* ⬅️ this is key */
  width: 100vw;
  height: auto;
  background: black;
  overflow-x: hidden;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  transition: background 0.5s;
  background-size: cover;
  background-position: center;
}

.bg-step-0 {
  background: black; /* Archetypes layout */
}

.bg-step-1 {
  background-image: url('@/assets/world_map.png'); /* Add your map image here */
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  
}


.bg-step-2 {
  background: black; /* Timeline feel */
}


.graphic {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent; /* or black if needed */
  z-index: 100;
  pointer-events: all; /* optional, if interactions are blocking */
}


.steps {
  width: 100vw;
  padding: 10vh 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0vh; /* ⬅️ big spacing between steps to allow scroll trigger */
  z-index: -2;
  font-family: 'Merriweather', serif;
}

.step {
  font-size: 24px;
  color: rgba(255, 255, 255, 1);
  text-align: center;
  height: 100vh; /* Each step gets a full viewport scroll trigger */
  display: flex;
  align-items: center;
  justify-content: center;
}

.tooltip {
  max-width: 300px;
  position: absolute;
  display: block;
  background: #000000dd;
  padding: 6px 10px;
  font-size: 16px;
  border-radius: 6px;
  pointer-events: none;
  font-family: 'inter', serif;
  z-index: 9999;
}
.character-card-button {
  z-index: 100;
  top: 40px;
  left: 40px;
  background-color: #ffffff;
  color: rgb(255, 0, 0);
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
