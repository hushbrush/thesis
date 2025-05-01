<template>
  <div class="lineage-container">
    <svg ref="lineage" :width="chartWidth" :height="chartHeight"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import data from '@/assets/data.json';

export default {
  props: {
    selectedArchetype: Number
    // removed clusterMeta prop
  },
  data() {
    return {
      chartWidth: window.innerWidth,
      chartHeight: window.innerHeight * 2/3,
      allData: data,
      filteredData: []
    };
  },
  computed: {
    // expose the shared global clusterMeta
    clusterMeta() {
      return this.$clusterMeta;
    }
  },
  watch: {
    selectedArchetype: {
      handler(newVal) {
        this.filteredData = this.allData.filter(d => d.archetype === newVal && d.original_date);
        this.updateLineage();
      },
      immediate: true
    }
  },
  methods: {
    updateLineage() {
      const svg = d3.select(this.$refs.lineage);
      svg.selectAll('*').remove();

      const margin = { top: 40, right: 140, bottom: 120, left: 80 };
      const width = this.chartWidth - margin.left - margin.right;
      const height = this.chartHeight - margin.top - margin.bottom;

      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      this.filteredData.sort((a, b) => a.original_date - b.original_date);

      const minDate = d3.min(this.filteredData, d => d.original_date);
      const maxDate = d3.max(this.filteredData, d => d.original_date);
      const xPadding = (maxDate - minDate) * 0.05;

      const xScale = d3.scaleLinear()
        .domain([minDate - xPadding, maxDate + xPadding])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

      const nodes = this.filteredData.map(d => ({
        ...d,
        x: xScale(d.original_date),
        y: yScale(d.strength)
      }));

      const simulation = d3.forceSimulation(nodes)
        .force('x', d3.forceX(d => xScale(d.original_date)).strength(1))
        .force('y', d3.forceY(d => yScale(d.strength)).strength(0.1))
        .force('collision', d3.forceCollide(10))
        .alphaDecay(0.03)
        .on('tick', ticked);

      const circles = chart.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
        .style('opacity', 0.9);

      function ticked() {
        circles
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      }

      // axes and tooltip logic unchanged…
    }
  }
}
</script>



<style scoped>
.lineage-container {
  background: black;
  padding: 2rem;
  max-width: 100%;
 
}
</style>
