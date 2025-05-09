<template>
   <p class =hoverDetails>Hover to see details </p>
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
    titleCase(str) {
    return str
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
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
          .text(t => this.titleCase(t))  
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

      // Y axis
      chart.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll("text")
          .attr('class', 'axis-label-y');

      // tooltip: I'm pretty sure this wasnt working atm so  will have to come back to this in the end. 
      // const tooltip = document.getElementById('tooltip');



      // grab the base color for the selected archetype
      const baseColor = this.clusterMeta[this.selectedArchetype]?.color || 'white';

      chart.selectAll('rect')
        .on('mouseover', (event, d) => {
          
          chart.selectAll('rect').style('opacity', 0.2);
          chart.selectAll('rect')
            .filter(d2 =>
              d2.character === d.character ||
              d2.characteristic === d.characteristic
            )
            .style('opacity', 1);

      
           // 1) Compute avg for this characteristic:
          const avg = d3.mean(this.filteredData, row => {
            const cm = new Map(row.characteristics);
            return cm.get(d.characteristic) || 0;
          });

          // 2) Update the <p> with hovered + average:
          d3.select('.hoverDetails')
          .html(
                `<span class="hover-characteristic">` +
                  `${this.titleCase(d.characteristic)}:` +
                `</span><br/>` +
                `${d.character}: ${(d.value * 100).toFixed(0)}%<br/>` +
                `Archetype Avg: ${(avg * 100).toFixed(0)}%`
              )
              .style('color', baseColor)
              .style('font-size', '28px')
          
        })
        .on('mouseout', () => {
          
          chart.selectAll('rect').style('opacity', 1)
          d3.select('.hoverDetails')
            .text('Hover to see details')
            .style('color', 'white')
            .style('font-size', '28px')
            .style('opacity', 1);

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
  padding: 0, 2rem;
}
.axis-label-x {
  font-size: 20px;
  fill: white;
}
p{
  color: white;
  font-size: 28px;
  font-family: 'Jaro';
  text-align: left;
}
.hoverDetails{
  height: 80px; 
  fill: white;
  margin: 0px;
  white-space: pre-line;
  line-height: 95%;
  padding-top: 0.5rem;
  /* padding-bottom: 8rem; */
}

.hoverDetails ::v-deep .hover-characteristic  {
  display: inline-block;
  font-size: 28px;       
  font-weight: bold;
  text-transform: uppercase; 
  margin-bottom: 1px;
  color: white;
  letter-spacing: 1.5;
 
}
.hoverDetails p,
.hoverDetails .hover-characteristic {
  margin: 0;
  padding: 0;
}
</style>
