<!-- legend on the left of scatter, tick text being white, adding tooltip for 2 and 3 and then go back to scrollstage and add it to the timeline there too.  -->

<template>
  <div class="scatter-container">
    <div class="scatter-layout">
      
      <div class="chart-section">
        <svg ref="scatter" :width="chartWidth" :height="chartHeight"></svg>
      </div>
      
      <div class="right-section">
        <button @click="zoomed = !zoomed" class="zoom-button">
          {{ zoomed ? "Reset Zoom" : "Zoom into Quadrants" }}
        </button>
        
         <div
          class="legend-container"
          ref="legend"
        ></div>
    

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
      zoomed:        false,
      chartWidth:   window.innerWidth * 4/5,
      chartHeight:  window.innerHeight * 2/3,
      allData:      data,
      archetypeData: []   // <- just the rows for this archetype
    };
  },

  methods: {
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

      // draw axes through the 0.5 midpoints
      // bottom axis
chart.append('g')
  .attr('transform', `translate(0, ${yScale(0.5)})`)
  .call(d3.axisBottom(xScale))
  // recolor the domain line and tick lines:
  .selectAll('path, line')
    .attr('stroke', 'white')
    .style('stroke-width', 3)

  .selectAll('text')      // then recolor the tick labels
    .attr('fill', 'white');

// left axis
chart.append('g')
  .attr('transform', `translate(${xScale(0.5)}, 0)`)
  .call(d3.axisLeft(yScale))
  .selectAll('path, line')
    .attr('stroke', 'white')
    .style('stroke-width', 3)
  .selectAll('text')
    .attr('fill', 'white');


      // compute averages for this archetype
      const averages = {};
      allCharacteristics.forEach(char => {
        const total = this.archetypeData.reduce((sum,d) => {
          const m = new Map(d.characteristics);
          return sum + (m.get(char)||0);
        }, 0);
        averages[char] = total / this.archetypeData.length;
      });

      const sorted = Object.keys(averages)
        .sort((a,b)=>averages[b]-averages[a]);
      const highest = sorted[0];
      const lowest  = sorted[sorted.length-1];

      // plot *all* characters by those two axes
      chart.selectAll('circle')
        .data(this.allData)
        .enter().append('circle')
          .attr('cx', d => {
            const m = new Map(d.characteristics);
            return xScale(m.get(highest)||0);
          })
          .attr('cy', d => {
            const m = new Map(d.characteristics);
            return yScale(m.get(lowest)||0);
          })
          .attr('r', 8)
          .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
          .style('opacity', 0.8);

      // axis labels
      chart.append('text')
        .attr('class','axis-label')
        .attr('x', width-10)
        .attr('y', yScale(0.5)-10)
        .attr('text-anchor','end')
        .text(highest);

      chart.append('text')
        .attr('class','axis-label')
        .attr('x', xScale(0.5)+10)
        .attr('y', 10)
        .attr('text-anchor','start')
        .text(lowest);

      // tooltip
      const tooltip = document.getElementById('tooltip');
      chart.selectAll('circle')
        .on('mouseover', function(event,d) {
          const m = new Map(d.characteristics);
          tooltip.classList.add('visible');
          tooltip.innerHTML = `
            <div style="font-weight:bold;font-size:20px;margin-bottom:6px;">
              ${d.character}
            </div>
            <div style="font-size:14px;margin-bottom:4px;">
              ${highest}: ${(m.get(highest)*100||0).toFixed(0)}%
            </div>
            <div style="font-size:14px;margin-bottom:4px;">
              ${lowest}: ${(m.get(lowest)*100||0).toFixed(0)}%
            </div>
            <div style="font-size:14px;">${d.bio}</div>
            <div style="font-style:italic;font-size:14px;">${d.title}</div>
          `;
          chart.selectAll('circle').style('opacity',0.1);
          d3.select(this)
            .style('stroke','white')
            .style('stroke-width',2)
            .style('opacity',1);
          chart.selectAll('circle')
            .filter(d2=>d2.archetype===d.archetype)
            .style('opacity',1);
        })
        .on('mousemove', e => {
          tooltip.style.left = `${e.pageX+12}px`;
          tooltip.style.top  = `${e.pageY-30}px`;
        })
        .on('mouseout', () => {
          tooltip.classList.remove('visible');
          chart.selectAll('circle')
            .style('opacity',0.8)
            .style('stroke','none');
        });
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
.scatter-container {
  background: black;
 
}
.scatter-layout {
  display: flex;
}

.zoom-button {
  background: rgba(255,255,255,0.1); border:2px solid white;
  color:white; padding:.5rem 1rem; font-family:Jaro;
  border-radius:8px; cursor:pointer;
  
  
}
.zoom-button:hover {
  background:rgb(85, 85, 85); color:white;
}
.axis-label {
  fill: white; font-size: 18px;
}
.right-section { 
  font-family: 'Jaro, sans-serif';
 }
</style>
