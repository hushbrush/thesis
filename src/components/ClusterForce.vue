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
      clusterCount: 8
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
        .attr('y', d => d.y - 200)
        .attr('text-anchor', 'middle')
        .attr('fill', (d, i) => this.$clusterMeta[i]?.color || 'white')
        .attr('font-size', 18)
        .text((d, i) => this.$clusterMeta[i]?.name || `Cluster ${i}`)

      // D3 Force Simulation
      const simulation = d3.forceSimulation(this.nodes)
        .force('x', d3.forceX(d => clusterCenters[d.archetype]?.x).strength(0.7))
        .force('y', d3.forceY(d => clusterCenters[d.archetype]?.y).strength(0.7))
        .force('collision', d3.forceCollide(15))
        .force('charge', d3.forceManyBody().strength(-10))
        .alphaDecay(0.02)
        .velocityDecay(0.5)
        .on('tick', ticked)


      // Create nodes
      const node = svg.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', d => 15)
        .attr('fill', d => this.$clusterMeta[d.archetype]?.color || 'white')
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
