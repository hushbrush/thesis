<template>
  <div class="scrolly-container">
    <div class="background-layer" :class="'bg-step-' + currentStep"></div>
    <div class="graphic" ref="chart"></div>

    <div class="steps">
      <div class="step" data-step="0"></div>
      <div class="step" data-step="1"></div>
      <div class="step" data-step="2"></div>
      <div class="step" data-step="3" style="height: 120vh;">Scroll down to continue...</div>
    </div>
<!-- extra space to scroll into next section -->
<div style="height: 100vh;"></div>

    <div v-if="showArchetypeSection">
      <ArchetypeMicro />
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import scrollama from 'scrollama'
import data from '@/assets/data.json'
import { computeClusterCentersBySize } from '@/utils/clusterSorter.js'
import ArchetypeMicro from '@/components/ArchetypeMicro.vue'

export default {
  components: { ArchetypeMicro },
  emits: ['reached-end'],

  data() {
    return {
      nodes: data,
      showArchetypeSection: false,
      width: window.innerWidth,
      height: window.innerHeight,
      currentStep: 0,
      svg: null,
      simulation: null,
      node: null
    }
  },

  mounted() {
    if (!this.$clusterMeta) {
      console.warn('⚠️ $clusterMeta is not defined! Check main.js')
    }

    this.svg = d3.select(this.$refs.chart)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    this.drawInitialNodes()
    this.setupScrollama()
  },

  methods: {
    ticked() {
      this.node.attr('cx', d => d.x).attr('cy', d => d.y)
    },

    drawInitialNodes() {
      this.createLabels()
      this.createNodes()
      this.bindTooltip()
      this.createSimulation()
    },

    createLabels() {
      const centers = computeClusterCentersBySize(this.nodes, this.width*6/7, this.height, 220)
      this.svg.selectAll('.cluster-label').remove()

      this.svg.selectAll('text.cluster-label')
        .data(centers)
        .enter()
        .append('text')
        .attr('class', 'cluster-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y - 200)
        .attr('text-anchor', 'middle')
        .attr('fill', (d, i) => this.$clusterMeta[i]?.color || 'white')
        .attr('font-size', 28)
        .attr('font-family', 'jaro')
        .text((d, i) => this.$clusterMeta[i]?.name)
    },

    createNodes() {
      this.node = this.svg.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', d => this.$clusterMeta[d.archetype]?.color || 'white')
        .attr('opacity', 0.9)
    },

    bindTooltip() {
      this.node
        .on('mouseover', function (event, d) {
          const tooltip = document.getElementById('tooltip')
          d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2)
          tooltip.style.display = 'block'
          tooltip.innerHTML = `
            <div style="font-weight: bold; font-size: 20px;">${d.character}</div>
            <div style="font-size: 14px; opacity: 0.8;">Archetype: ${d.archetype}</div>
            <div>${d.bio}</div>
            <div style="font-style: italic;">${d.title}</div>`
        })
        .on('mousemove', function (event) {
          const tooltip = document.getElementById('tooltip')
          tooltip.style.left = `${event.pageX + 12}px`
          tooltip.style.top = `${event.pageY - 30}px`
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke', null)
          document.getElementById('tooltip').style.display = 'none'
        })
    },

    createSimulation() {
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
      scroller.setup({ step: '.step', offset: 0.6 })
        .onStepEnter(({ index }) => {
          this.currentStep = index
          this.updateLayout(index)
          if (index === 3) {
            setTimeout(() => {
              this.$emit('reached-end')
            }, 2000) // Try 500–800ms to start with
          }

        })
    },

    updateLayout(index) {
      this.svg.selectAll('.cluster-label').remove()
      this.svg.selectAll('.timeline-line, .timeline-text, .uncertainty').remove()

      if (index === 0) this.drawClusterLayout()
      if (index === 1) this.drawMapLayout()
      if (index === 2) this.drawTimelineLayout()
    },

    drawClusterLayout() {
      const centers = computeClusterCentersBySize(this.nodes, this.width, this.height, 210)
      this.createLabels()

      this.simulation
  .force('x', d3.forceX(d => centers[d.archetype]?.x).strength(0.6))
  .force('y', d3.forceY(d => centers[d.archetype]?.y).strength(0.6))
  .alpha(0.8)
  .alphaDecay(0.03)
  .velocityDecay(0.5)
  .restart()

    },

    drawMapLayout() {
      const projection = d3.geoMercator()
        .center([0, 20])
        .scale(this.width / 6.5)
        .translate([this.width / 2, this.height / 2])

        this.simulation
  .force('x', d3.forceX(d => projection([d.lon, d.lat])[0]).strength(0.3))
  .force('y', d3.forceY(d => projection([d.lon, d.lat])[1]).strength(0.3))
  .alpha(0.8)            // strong initial movement
  .alphaDecay(0.05)     // SLOW decay — longer visible motion
  .velocityDecay(0.5)   // floatier movement, not snappy
  .restart()



      
    },

    drawTimelineLayout() {
      this.simulation.stop()

      const timeExtent = d3.extent(this.nodes, d => +d.original_date || 0)
      const xScale = d3.scaleLinear()
        .domain([timeExtent[0] - 100, timeExtent[1] + 100])
        .range([100, this.width - 100])

      this.svg.append('g')
        .attr('transform', `translate(0, ${this.height - 40})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text').style('fill', 'white')

      this.svg.append("line")
        .attr("class", "timeline-line")
        .attr("x1", xScale(0))
        .attr("x2", xScale(0))
        .attr("y1", 0)
        .attr("y2", this.height)
        .attr("stroke", "white")
        .attr("stroke-width", 1)

      this.svg.append("text")
        .attr("class", "timeline-text")
        .attr("x", xScale(0) + 8)
        .attr("y", 20)
        .text("Birth of Christ")
        .style("fill", "white")
        .style("font-size", "12px")

      const stackMap = new Map()
      const spacing = 10
      const baseY = this.height - 80
      const nodePositions = []

      for (const d of this.nodes) {
        const x = xScale(d.original_date)
        const count = stackMap.get(x) || 0
        const y = baseY - count * spacing
        stackMap.set(x, count + 1)

        this.svg.append("rect")
          .attr("class", "uncertainty")
          .attr("x", xScale(d.original_date - d.date_range_confidence))
          .attr("y", y - 10)
          .attr("width", xScale(d.original_date + d.date_range_confidence) - xScale(d.original_date - d.date_range_confidence))
          .attr("height", 18)
          .attr("fill", this.$clusterMeta[d.archetype]?.color || '#888')
          .attr("opacity", 0.1)
          .attr("rx", 10)

        nodePositions.push({ ...d, x, y })
      }

      this.node
        .data(nodePositions, d => d.character)
        .transition()
        .duration(1700)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    }
  }
}
</script>

<style scoped>
.scrolly-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: black;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: background 0.5s;
}

.bg-step-0 { background: black; }
.bg-step-1 { background-image: url('@/assets/world_map.png'); background-color: black; }
.bg-step-2 { background: black; }

.graphic {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  background: transparent;
}

.steps {
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.step {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.step[data-step="3"] {
  height: 120vh;
  background: black;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step[data-step="0"] {
  height: 140vh;
 
}
.global-tooltip {
  max-width: 300px;
  position: absolute;
  display: none;
  background: #000000dd;
  padding: 6px 10px;
  font-size: 16px;
  border-radius: 6px;
  pointer-events: none;
  color: white;
  z-index: 9999;
}
</style>
