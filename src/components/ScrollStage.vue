<template>
  <div class="scrolly-container">
    <div class="background-layer" :class="'bg-step-' + currentStep"></div>

    <div class="graphic" ref="chart"></div>

    <div class="steps">
      <div class="step" data-step="0"></div>
      <div class="step" data-step="1"></div>
      <div class="step" data-step="2"></div>

    </div>
    <!-- At the end of the timeline layout component -->
    <div v-if="showArchetypeSection">
      <ArchetypeMicro />
    </div>
<button @click="$emit('show-card')" class="character-card-button">
  View Character Details
</button>
  </div>
</template>


<script>
import * as d3 from 'd3'
import scrollama from 'scrollama'
import data from '@/assets/data.json'
import { computeClusterCentersBySize } from '@/utils/clusterSorter.js'
import ArchetypeMicro from '@/components/ArchetypeMicro.vue'

export default {
  components: {
    ArchetypeMicro
  },
  data() {
    return {
      nodes: data,
      showArchetypeSection: false,
      width: window.innerWidth,
      height: window.innerHeight,
      currentStep: 0,
      svg: null,
      tooltip: null,
      simulation: null,
      node: null,
    }
  },
  computed: {
    // expose the global clusterMeta
    clusterMeta() {
      return this.$clusterMeta
    }
  },
  mounted() {
    if (this.simulation) this.simulation.stop()

    this.svg = d3.select(this.$refs.chart)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    this.drawInitialNodes()
    this.drawClusterLayout()
    this.setupScrollama()
  },
  methods: {
    ticked() {
      this.node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    },

    drawInitialNodes() {
      this.createLabels()
      this.createNodes()
      this.bindTooltip()
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
        .attr('fill', (d, i) => this.clusterMeta[i].color || 'white')
        .attr('font-size', 18)
        .text((d, i) => this.clusterMeta[i].name || `Cluster ${i}`)
    },

    createNodes() {
      this.node = this.svg.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
        .attr('opacity', 0.9)
    },

    bindTooltip() {
      this.node
        .on('mouseover', function(event, d) {
          const tooltip = document.getElementById('tooltip')
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
        .on('mousemove', function(event) {
          const tooltip = document.getElementById('tooltip')
          tooltip.style.left = `${event.pageX + 12}px`
          tooltip.style.top = `${event.pageY - 30}px`
        })
        .on('mouseout', function() {
          const tooltip = document.getElementById('tooltip')
          d3.select(this).attr('stroke', null)
          tooltip.style.display = 'none'
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
      scroller.setup({ step: '.step', offset: 0.5, debug: false })
        .onStepEnter(({ index }) => {
          this.currentStep = index
          this.updateLayout(index)
        })
        .onStepExit(({ index, direction }) => {
          if (direction === 'up' && index > 0) {
            this.currentStep = index - 1
            this.updateLayout(index - 1)
          }
        })
    },

    updateLayout(index) {
      if (index === 0) this.drawClusterLayout()
      if (index === 1) this.drawMapLayout()
      if (index === 2) this.drawTimelineLayout()
    },

    drawClusterLayout() {
      this.svg.selectAll('g, line, .uncertainty').remove()
      this.createLabels()
      const clusterCenters = computeClusterCentersBySize(this.nodes, this.width, this.height, 210)
      this.simulation
        .force('x', d3.forceX(d => clusterCenters[d.archetype].x).strength(0.7))
        .force('y', d3.forceY(d => clusterCenters[d.archetype].y).strength(0.7))
        .alpha(1)
        .restart()
    },

    drawMapLayout() {
      this.svg.selectAll('g, line, .uncertainty, text.cluster-label').remove()
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
    },

    drawTimelineLayout() {
      this.simulation.stop()
      this.svg.selectAll('g, line, text, .uncertainty').remove()

      const timeExtent = d3.extent(this.nodes, d => +d.original_date || 0)
      const xScale = d3.scaleLinear()
        .domain([timeExtent[0] - 100, timeExtent[1] + 100])
        .range([100, this.width - 100])

      const xAxis = d3.axisBottom(xScale).tickFormat(d => d)
      this.svg.append('g')
        .attr('transform', `translate(0, ${this.height - 40})`)
        .call(xAxis)
        .selectAll('text').style('fill', 'white')

      this.svg.append('line')
        .attr('x1', xScale(0)).attr('x2', xScale(0))
        .attr('y1', 0).attr('y2', this.height)
        .attr('stroke', 'white').attr('stroke-width', 1)

      this.svg.append('text')
        .attr('x', xScale(0) + 8).attr('y', 20)
        .text('Birth of Christ')
        .style('fill', 'white').style('font-size', '12px')

      // stack & draw uncertainty bars then transition circles…
      // (rest unchanged)
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent; /* or black if needed */
  z-index: 1;
  pointer-events: all; /* optional, if interactions are blocking */
}


.steps {
  width: 100%;
  padding: 10vh 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0vh; /* ⬅️ big spacing between steps to allow scroll trigger */
  z-index: 2;
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
.archetype-micro-container {
  background: black;
  padding: 2rem;
  min-height: 100vh; /* <-- force it to be at least 1 screen high */
}

</style>
