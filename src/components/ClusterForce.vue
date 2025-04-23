<template>
    <div class="cluster-container" ref="chart"></div>
    <div class="tooltip" ref="tooltip"></div>
    

  </template>
  
  <script>
  import * as d3 from 'd3'
  import data from '@/assets/data.json'
  import { computeClusterCentersBySize } from '@/utils/clusterSorter.js'
export default {
  name: 'ClusterForce',
  props: ['nodes'],
  emits: ['next'],

  data() {
    return {
        
      width: window.innerWidth,
      height: window.innerHeight,
      clusterCount: 8,
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
    this.createChart()
  },

  methods: {
    createChart() {
      const svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)

      // Compute cluster centers (center-aligned horizontally by total node size)
      const clusterCenters = computeClusterCentersBySize(this.nodes, this.width, this.height, 210)

      // Draw cluster labels
      svg.selectAll('text.cluster-label')
        .data(clusterCenters)
        .enter()
        .append('text')
        .attr('class', 'cluster-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y -200)
        .attr('text-anchor', 'middle')
        .attr('fill', (d, i) => this.clusterMeta[i]?.color || 'white')
        .attr('font-size', 18)
        .text((d, i) => this.clusterMeta[i]?.name || `Cluster ${i}`)

      // D3 Force Simulation
      const simulation = d3.forceSimulation(this.nodes)
        .force('x', d3.forceX(d => clusterCenters[d.archetype]?.x).strength(d => d.strength))
        .force('y', d3.forceY(d => clusterCenters[d.archetype]?.y).strength(d => d.strength))
        .force('collision', d3.forceCollide(d => d.size || 20))
        .force('charge', d3.forceManyBody().strength(-10))
        .alphaDecay(0.02)
        .velocityDecay(0.5)
        .on('tick', ticked)

      // Create nodes
      const node = svg.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.size / 1.1 || 20)
        .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
        .attr('opacity', 0.9)

      // Tooltip logic
      const tooltip = this.$refs.tooltip

      node.on('mouseover', function (event, d) {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 2)
        tooltip.style.display = 'block'
        tooltip.innerText = d.character
      })
        .on('mousemove', function (event) {
          tooltip.style.left = `${event.pageX + 12}px`
          tooltip.style.top = `${event.pageY - 30}px`
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke', null)
          tooltip.style.display = 'none'
        })

      function ticked() {
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
      }
    }
  }
}
</script>

<style scoped>
.cluster-container {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  position: relative;
}

.tooltip {
  position: absolute;
  display: none;
  background: #ffffffdd;
  color: black;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 6px;
  pointer-events: none;
  font-family: 'Merriweather', serif;
  z-index: 10;
  box-shadow: 0 2px 6px #00000055;
}

.next-button {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #FDB749, #DBF39D);
  color: black;
  font-size: 18px;
  padding: 10px 30px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  z-index: 5;
}
</style>