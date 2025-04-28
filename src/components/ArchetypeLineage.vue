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
    selectedArchetype: Number,
    clusterMeta: Array
  },
  data() {
    return {
      chartWidth: window.innerWidth,
      chartHeight: window.innerHeight * 2/3,
      allData: data,
      filteredData: []
    };
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

  const xPadding = (maxDate - minDate) * 0.05; // 5% padding on both sides

const xScale = d3.scaleLinear()
  .domain([minDate - xPadding, maxDate + xPadding]) // <- shifted
  .range([0, width]);


  // Now Y is inverted: strength 1 is near center, strength 0 farther away
  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  // Create nodes
  const nodes = this.filteredData.map(d => ({
    ...d,
    x: xScale(d.original_date),
    y: yScale(d.strength)
  }));

  // Force simulation
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
    .attr('r',  10)
    .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
    .style('opacity', 0.9);

  function ticked() {
    circles
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  // X Axis (Years)
  const xAxis = d3.axisBottom(xScale)
    .ticks(10)
    .tickFormat(d3.format('d'));

  chart.append('g')
    .attr('transform', `translate(0, ${height + 20})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(30)')
    .style('text-anchor', 'start')
    .style('font-size', '12px');

  chart.append('text')
    .attr('x', width / 2)
    .attr('y', height+70) 
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .text('Year');

  // Y Axis (Closeness to Archetype)
  const yAxis = d3.axisLeft(yScale)
    .ticks(5)
    .tickFormat(d => `${(d * 100).toFixed(0)}%`);

  chart.append('g')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', '12px');

  // Y Axis Label
  chart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -50)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis-label')
    .text('Closeness to Archetype');

  // Tooltip logic
  const tooltip = document.getElementById('tooltip');

  circles
    .on('mouseover', function(event, d) {
      tooltip.classList.add('visible');
      tooltip.innerHTML = `
        <div style="font-weight: bold; font-size: 20px; margin-bottom: 6px;">
          ${d.character}
        </div>
        <div style="font-size: 14px;">Year: ${d.original_date}</div>
        <div style="font-size: 14px;">Strength: ${(d.strength * 100).toFixed(0)}%</div>
        <div style="font-size: 14px; font-style: italic;"> ${d.title}</div>
      `;
      d3.selectAll('circle').style('opacity', 0.2);
      d3.select(this)
        .style('stroke', 'white')
        .style('stroke-width', 2)
        .style('opacity', 1);
    })
    .on('mousemove', function(event) {
      tooltip.style.left = `${event.pageX + 12}px`;
      tooltip.style.top = `${event.pageY - 30}px`;
    })
    .on('mouseout', function() {
      tooltip.classList.remove('visible');
      d3.selectAll('circle')
        .style('opacity', 0.9)
        .style('stroke', 'none');
    });
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
