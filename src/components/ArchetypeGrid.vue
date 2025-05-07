<template>
  <div class="viz-container">
    <svg ref="chart" :width="chartWidth" :height="chartHeight"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import data from '@/assets/data.json';
import { allCharacteristics } from '@/assets/characteristics.js';

export default {
  props: {
    selectedArchetype: { type: Number, required: true },
    clusterMeta:       { type: Array,  required: true }
  },

  data() {
    return {
      chartWidth: window.innerWidth,
      chartHeight: window.innerHeight * 2/3,
      allData: data,
      filteredData: []
    };
  },

  methods: {
    hexToRgb(hex) {
      hex = hex.replace(/^#/, '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    },

    setFilteredData() {
      if (this.selectedArchetype == null) {
        this.filteredData = [];
      } else {
        this.filteredData = this.allData.filter(
          d => d.archetype === this.selectedArchetype
        );
      }
    },

    updateChart() {
      const svg = d3.select(this.$refs.chart);
      svg.selectAll('*').remove();
      if (this.selectedArchetype == null) return;

      const margin = { top: 20, right: 150, bottom: 100, left: 90 };
      const width = this.chartWidth - margin.left - margin.right;
      const height = this.chartHeight - margin.top - margin.bottom;
      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const characters = this.filteredData.map(d => d.character);
      const baseColorRGB = this.hexToRgb(
        this.clusterMeta[this.selectedArchetype]?.color || '#ccff66'
      );

      const colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["#000000", `rgb(${baseColorRGB})`]);

      const xScale = d3.scaleBand()
        .domain(allCharacteristics)
        .range([0, width])
        .padding(0.1);

      const yScale = d3.scaleBand()
        .domain(characters)
        .range([0, height])
        .padding(0.1);

      // flatten into one cell per (characteristic, character)
      const cells = [];
      this.filteredData.forEach(d => {
        const charMap = new Map(d.characteristics.map(c => [c[0], c[1]]));
        allCharacteristics.forEach(charac => {
          cells.push({
            character: d.character,
            characteristic: charac,
            value: charMap.get(charac) || 0,
            title: d.title,
            bio: d.bio
          });
        });
      });

      // draw the heatmap rectangles
      chart.selectAll('rect')
        .data(cells)
        .enter()
        .append('rect')
          .attr('x', d => xScale(d.characteristic))
          .attr('y', d => yScale(d.character))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .attr('fill', d => colorScale(d.value))
          .style('opacity', 1)
          .style('border-radius', '50px');

      // X axis
      chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
          .attr('class', 'axis-label-x')
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

      // Y axis
      chart.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll("text")
          .attr('class', 'axis-label-y');

      // tooltip behavior
      const tooltip = document.getElementById('tooltip');
      // grab the base color for the selected archetype
      const baseColor = this.clusterMeta[this.selectedArchetype]?.color || 'white';

      chart.selectAll('rect')
        .on('mouseover', (event, d) => {
          tooltip.classList.add('visible');
          tooltip.innerHTML = `
            <div style="font-weight:bold;font-size:20px;margin-bottom:6px;">
              ${d.character}: ${(d.value*100).toFixed(0)}% ${d.characteristic}
            </div>
            <div style="font-size:14px;">${d.bio}</div>
            <div style="font-style:italic;font-size:14px;">${d.title}</div>`;
          chart.selectAll('rect').style('opacity', 0.2);
          chart.selectAll('rect')
            .filter(d2 =>
              d2.character === d.character ||
              d2.characteristic === d.characteristic
            )
            .style('opacity', 1);
            chart.selectAll('.axis-label-x')
            .style('font-size', td => td === d.characteristic ? '40px' : null)
            .style('fill',       td => td === d.characteristic ? baseColor : null)
            .style('background', 'rgba(0,0,0,0.5)')
            .style('rotate', '45deg')
            .style('padding',    '2px');

          // **highlight the matching Y‐tick** 
          chart.selectAll('.axis-label-y')
            .style('font-size', td => td === d.character    ? '40px' : null)
            .style('fill',       td => td === d.character    ? baseColor : null)
            .style('background', 'rgba(0,0,0,0.5)')
            .style('padding',    '2px')
            .style('z-index', 1000);
        })
        .on('mousemove', event => {
          tooltip.style.left = `${event.pageX + 12}px`;
          tooltip.style.top  = `${event.pageY - 30}px`;
        })
        .on('mouseout', () => {
          tooltip.classList.remove('visible');
          chart.selectAll('rect').style('opacity', 1)
          chart.selectAll('.axis-label-x')
          .style('rotate', '-45deg');
        });
    }
  },

  mounted() {
    console.log(
      '[ArchetypeGrid] mounted, received selectedArchetype =',
      this.selectedArchetype
    );
    this.setFilteredData();
    this.updateChart();
  },

  watch: {
    selectedArchetype(newVal) {
      console.log('[ArchetypeGrid] archetype changed →', newVal);
      this.setFilteredData();
      this.updateChart();
    }
  }
};
</script>

<style scoped>
.viz-container {
  background: black;
  color: white;
  padding: 2rem;
}
.axis-label-x {
  font-size: 20px;
  fill: white;
}
</style>
