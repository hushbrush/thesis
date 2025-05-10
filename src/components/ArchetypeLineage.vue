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
      chartWidth:  window.innerWidth,
      chartHeight: window.innerHeight * 2/3,
      allData:     data
    }
  },
  computed: {
    clusterMeta() {
      return this.$clusterMeta
    }
  },
  mounted() {
    this.drawLineage()
  },
  watch: {
    selectedArchetype() {
      this.drawLineage()
    }
  },
  methods: {
    showCharacterTooltip(d, x, y) {
      this.clearCharacterTooltip()
      const widthEstimate = Math.max(
        d.character.split(/\s+/).reduce((acc, w) => acc + w.length * 14, 0) + 40,
        280
      )
      // Name tooltip
      d3.select(this.$refs.lineage)
        .append('foreignObject')
          .attr('class', 'hover-tooltip name')
          .attr('x', x)
          .attr('y', y + 10)
          .attr('width', widthEstimate)
          .attr('height', 140)
        .append('xhtml:div')
          .style('background', 'black')
          .style('border', `2px solid ${this.clusterMeta[d.archetype].color}`)
          .style('border-radius', '15px')
          .style('padding', '4px')
          .style('color', this.clusterMeta[d.archetype].color)
          .style('font-family', 'Jaro')
          .style('font-size', '40px')
          .style('text-align', 'center')
          .text(d.character)

      // Bio tooltip
      d3.select(this.$refs.lineage)
        .append('foreignObject')
          .attr('class', 'hover-tooltip bio')
          .attr('x', x - widthEstimate / 2)
          .attr('y', y + 100)
          .attr('width', widthEstimate * 2)
          .attr('height', 200)
        .append('xhtml:div')
          .style('background', 'black')
          .style('border', `2px solid ${this.clusterMeta[d.archetype].color}`)
          .style('border-radius', '15px')
          .style('padding', '10px')
          .style('color', this.clusterMeta[d.archetype].color)
          .style('font-family', 'Jura, sans-serif')
          .style('font-size', '16px')
          .style('line-height', '1.4')
          .html(`<br/> ${d.bio || ''}<br/>${d.title }<br/> Translated by ${d.translator }`);
    },

    clearCharacterTooltip() {
      d3.select(this.$refs.lineage).selectAll('.hover-tooltip').remove()
    },

    drawLineage() {
      const svg = d3.select(this.$refs.lineage)
      svg.selectAll('*').remove()

      const margin = { top: 40, right: 140, bottom: 120, left: 80 }
      const width  = this.chartWidth  - margin.left - margin.right
      const height = this.chartHeight - margin.top  - margin.bottom

      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      const filtered = this.allData
        .filter(d => d.archetype === this.selectedArchetype && d.original_date)
        .sort((a,b) => a.original_date - b.original_date)
      if (!filtered.length) return

      const dates = filtered.map(d => d.original_date)
      const pad  = (d3.max(dates) - d3.min(dates)) * 0.05
      const xScale = d3.scaleLinear()
        .domain([d3.min(dates) - pad, d3.max(dates) + pad])
        .range([0, width])

      const strengths = filtered.map(d => d.strength)
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(strengths)*1.1])
        .range([height, 0])

      const nodes = filtered.map(d => ({
        ...d,
        x: xScale(d.original_date),
        y: yScale(d.strength)
      }))

      const circles = chart.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
          .attr('r', 10)
          .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
          .style('opacity', 0.9)
        .on('mouseover', (event, d) => {
          const [mx, my] = d3.pointer(event, this.$refs.lineage)
          d3.select(event.currentTarget).raise().transition().duration(100).attr('r', 12)
          this.showCharacterTooltip(d, mx, my)
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget).transition().duration(100).attr('r', 10)
          this.clearCharacterTooltip()
        })

      d3.forceSimulation(nodes)
        .force('x', d3.forceX(d => xScale(d.original_date)).strength(1))
        .force('y', d3.forceY(d => yScale(d.strength)).strength(0.1))
        .force('collision', d3.forceCollide(12))
        .alphaDecay(0.03)
        .on('tick', () => {
          circles
            .attr('cx', d => Math.max(0, Math.min(width, d.x)))
            .attr('cy', d => Math.max(0, Math.min(height-10, d.y)))
        })

      const xAxis = chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format('d')))
      xAxis.selectAll('path, line').attr('stroke','white').style('stroke-width',3)
      xAxis.selectAll('text').attr('fill','white').attr('font-family','Oswald, sans-serif')

      const yAxis = chart.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => (d*100)+'%'))
      yAxis.selectAll('path, line').attr('stroke','white').style('stroke-width',3)
      yAxis.selectAll('text').attr('fill','white').attr('font-family','Oswald, sans-serif')

      chart.append('text')
        .attr('class','axis-label')
        .attr('x', width/2)
        .attr('y', height + 60)
        .attr('text-anchor','middle')
        .style('fill','white')
        .text('Original Date')

      chart.append('text')
        .attr('class','axis-label')
        .attr('transform','rotate(-90)')
        .attr('x', -height/2)
        .attr('y', -50)
        .attr('text-anchor','middle')
        .style('fill','white')
        .text('Closeness to Archetype')
    }
  }
}
</script>

<style scoped>
.lineage-container { background: black; padding: 2rem; }
.hover-tooltip.name div,
.hover-tooltip.bio div {
  white-space: normal;
}
</style>