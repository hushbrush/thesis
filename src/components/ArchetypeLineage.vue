<template>
  <div class="lineage-container">
    <svg ref="lineage" :width="chartWidth" :height="chartHeight"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import data from '@/assets/data.json'

export default {
  name: 'ArchetypeLineage',
  props: {
    selectedArchetype: { type: Number, required: true }
  },
  data() {
    return {
      chartWidth: window.innerWidth,
      chartHeight: window.innerHeight * 2/3,
      allData: data
    }
  },
  computed: {
    // global color lookup
    clusterMeta() {
      return this.$clusterMeta
    }
  },
  mounted() {
    this.drawLineage()
  },
  watch: {
    // redraw whenever the archetype changes
    selectedArchetype() {
      this.drawLineage()
    }
  },
  methods: {
    drawLineage() {
      const svg = d3.select(this.$refs.lineage)
      svg.selectAll('*').remove()

      const margin = { top: 40, right: 140, bottom: 120, left: 80 }
      const width  = this.chartWidth  - margin.left - margin.right
      const height = this.chartHeight - margin.top  - margin.bottom

      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // filter & sort
      const filtered = this.allData
        .filter(d => d.archetype === this.selectedArchetype && d.original_date)
        .sort((a, b) => a.original_date - b.original_date)

      // right after `const filtered = …`
      const strengths = filtered.map(d => d.strength);
      const maxStrength = d3.max(strengths) || 0;
      const yMax = maxStrength * 1.1;    // 10% cushion above your highest point


      if (!filtered.length) {
        // nothing to draw
        return
      }

      const dates = filtered.map(d => d.original_date)
      const minD = d3.min(dates), maxD = d3.max(dates)
      const pad  = (maxD - minD) * 0.05

      const xScale = d3.scaleLinear()
        .domain([minD - pad, maxD + pad])
        .range([0, width])

      const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0])

      // prep force nodes
      const nodes = filtered.map(d => ({
        ...d,
        x: xScale(d.original_date),
        y: yScale(d.strength)
      }))

      // draw points
      const circles = chart.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
          .attr('r', 10)
          .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
          .style('opacity', 0.9)

            d3.forceSimulation(nodes)
    .force('x', d3.forceX(d => xScale(d.original_date)).strength(1))
    .force('y', d3.forceY(d => yScale(d.strength)).strength(0.1))
    .force('collision', d3.forceCollide(12))
    .alphaDecay(0.03)
    .on('tick', () => {
      circles
        .attr('cx', d => {
          // clamp to [0, width]
          d.x = Math.max(0, Math.min(width, d.x))
          return d.x
        })
        .attr('cy', d => {
          // clamp to [0, height]
          d.y = Math.max(0, Math.min(height-10, d.y))
          return d.y
        })
    })

      // bottom axis
      const xAxis = chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format('d')))
      xAxis.selectAll('path, line').attr('stroke', 'white').style('stroke-width', 3)
      xAxis.selectAll('text').attr('fill', 'white').attr('font-family', 'Oswald, sans-serif')

      // left axis
      const yAxis = chart.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => (d * 100) + '%'))
      yAxis.selectAll('path, line').attr('stroke', 'white').style('stroke-width', 3)
      yAxis.selectAll('text').attr('fill', 'white').attr('font-family', 'Oswald, sans-serif')

      // axis labels
      chart.append('text')
        .attr('class', 'axis-label')
        .attr('x', width/2)
        .attr('y', height + 60)
        .attr('text-anchor', 'middle')
        .text('Original Date')
        .attr('fill', 'white')

      chart.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height/2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Closeness to Archetype')
        .attr('fill', 'white')

      // tooltip
      const tooltip = d3.select('#tooltip')
      circles
        .on('mouseover', (event, d) => {
          
        })
        .on('mousemove', event => {
          
        })
        .on('mouseout', () => {
         
        })
    }
  }
}
</script>

<style scoped>
.lineage-container {
  background: black;
  padding: 2rem;
}
.axis-label {
  font-family: Arial, sans-serif;
  font-size: 16px;
}
</style>
