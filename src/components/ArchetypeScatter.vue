<template>
  <div class="scatter-container">
    <div class="scatter-layout">
      <div class="chart-section">
        <svg
          ref="scatter"
          :width="chartWidth"
          :height="chartHeight"
          style="margin-left: 3rem;"
        ></svg>
      </div>
      <div class="right-section">
        <button @click="zoomed = !zoomed" class="zoom-button">
          {{ zoomed ? "Reset Zoom" : "Zoom into Left" }}
        </button>
        <div class="legend-container">
          <div
            v-for="(meta, idx) in clusterMeta"
            :key="idx"
            class="legend-item"
            :style="{ color: meta.color, opacity: filterArchetype === null || filterArchetype === idx ? 1 : 0.3 }"
            @click="onLegendClick(idx)"
          >
            {{ meta.name }}
          </div>
        </div>
      </div>
    </div>
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
      zoomed:         false,
      chartWidth:    window.innerWidth * 4/5,
      chartHeight:   window.innerHeight * 2/3,
      allData:       data,
      archetypeData: [],
      filterArchetype: null
    };
  },

  methods: {
    showCharacterTooltip(d, x, y) {
      this.clearCharacterTooltip();
      const widthEstimate = Math.max(
        d.character.split(/\s+/).reduce((acc, w) => acc + w.length * 14, 0) + 40,
        280
      );

      // Name tooltip
      d3.select(this.$refs.scatter)
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
          .text(d.character);

      // Bio tooltip
      d3.select(this.$refs.scatter)
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
      d3.select(this.$refs.scatter).selectAll('.hover-tooltip').remove();
    },

    onLegendClick(idx) {
      this.filterArchetype = this.filterArchetype === idx ? null : idx;
      this.updateScatter();
    },

    setArchetypeData() {
      this.archetypeData = this.allData.filter(
        d => d.archetype === this.selectedArchetype
      );
    },

    updateScatter() {
      const svg = d3.select(this.$refs.scatter);
      svg.selectAll('*').remove();

      const margin = { top: 20, right: 60, bottom: 60, left: 60 };
      const width  = this.chartWidth  - margin.left - margin.right;
      const height = this.chartHeight - margin.top  - margin.bottom;

      const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xDomain = this.zoomed ? [0.5,1] : [0,1];
      const yDomain = this.zoomed ? [0,1]   : [0,1];

      const xScale = d3.scaleLinear().domain(xDomain).range([0, width]);
      const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

      // Axes
      const xAxisG = chart.append('g')
        .attr('transform', `translate(0, ${yScale(0.5)})`)
        .call(d3.axisBottom(xScale))
      xAxisG.selectAll('path, line').attr('stroke', 'white').style('stroke-width', 3);
      xAxisG.selectAll('text').attr('font-family', 'Oswald, sans-serif').style('fill', 'white');

      const yAxisG = chart.append('g')
        .attr('transform', `translate(${xScale(0.5)}, 0)`)
        .call(d3.axisLeft(yScale))
      yAxisG.selectAll('path, line').attr('stroke', 'white').style('stroke-width', 3);
      yAxisG.selectAll('text').attr('font-family', 'Oswald, sans-serif').style('fill', 'white');

      // Characteristic averages
      const averages = {};
      allCharacteristics.forEach(char => {
        const total = this.archetypeData.reduce((sum,d) => {
          const m = new Map(d.characteristics);
          return sum + (m.get(char)||0);
        }, 0);
        averages[char] = total / this.archetypeData.length;
      });
      const sorted = Object.keys(averages).sort((a,b)=>averages[b]-averages[a]);
      const highest = sorted[0], lowest = sorted[sorted.length-1];

      const displayData = this.filterArchetype === null
        ? this.allData
        : this.allData.filter(d => d.archetype === this.filterArchetype);

      // Plot circles
      chart.selectAll('circle')
        .data(displayData)
        .join('circle')
          .attr('cx', d => xScale(new Map(d.characteristics).get(highest)||0))
          .attr('cy', d => yScale(new Map(d.characteristics).get(lowest)||0))
          .attr('r', 8)
          .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
          .style('opacity', 0.8)
        .on('mouseover', (event,d) => {
          const [mx,my] = d3.pointer(event, this.$refs.scatter);
          d3.select(event.currentTarget).raise().transition().duration(100).attr('r', 12);
          this.showCharacterTooltip(d, mx, my);
        })
        .on('mouseout', (event) => {
          d3.select(event.currentTarget).transition().duration(100).attr('r', 8);
          this.clearCharacterTooltip();
        });

      // Axis labels
      chart.append('text')
        .attr('class','axis-label')
        .attr('x', 20)
        .attr('y', yScale(0.5)-10)
        .attr('text-anchor','start')
        .style('fill','white')
        .text(highest);

      chart.append('text')
        .attr('class','axis-label')
        .attr('x', xScale(0.5)+10)
        .attr('y', 10)
        .attr('text-anchor','start')
        .style('fill','white')
        .text(lowest);
    }
  },

  mounted() {
    this.setArchetypeData();
    this.updateScatter();
  },

  watch: {
    selectedArchetype() {
      this.setArchetypeData();
      this.updateScatter();
    },
    zoomed() {
      this.updateScatter();
    }
  }
};
</script>

<style scoped>
.scatter-container { background: black; }
.scatter-layout { display: flex; }
.zoom-button {
  background: rgba(255,255,255,0.1); border:2px solid white;
  color:white; padding:.5rem 1rem; font-family:Jaro;
  border-radius:8px; cursor:pointer;
}
.zoom-button:hover { background:rgb(85,85,85); }
.axis-label { font-size:18px; }
.right-section { font-family: 'Jaro, sans-serif'; }
.legend-container { margin-top:3rem; }
.legend-item { font-family:'Jaro'; font-size:24px; padding-left:1rem; }
.legend-item:hover { transform: scale(1.2); }
.hover-tooltip.name, .hover-tooltip.bio {
  pointer-events: none;
}
.hover-tooltip.name div, .hover-tooltip.bio div {
  white-space: normal;
}
</style>
