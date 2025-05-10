<!-- legend on the left of scatter, tick text being white, adding tooltip for 2 and 3 and then go back to scrollstage and add it to the timeline there too.  -->

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
      zoomed:        false,
      chartWidth:   window.innerWidth * 4/5,
      chartHeight:  window.innerHeight * 2/3,
      allData:      data,
      archetypeData: [] ,  // <- just the rows for this archetype
      filterArchetype: null 
    };
  },

  methods: {
    showCharacterTooltip(d) {
    // exactly the same code you have in ScrollStage:
    const estimatedWidth = Math.max(
      d.character.split(/\s+/).reduce((acc, w) => acc + w.length * 14, 0) + 40,
      280
    );
    // Character name box
    d3.select(this.$refs.scatter)  // or this.svg if you kept that ref
      .append('foreignObject')
        .attr('class','hover-tooltip name')
        .attr('x', x /* compute x */)
        .attr('y', y /* compute y */)
        .attr('width', estimatedWidth)
        .attr('height', 140)
      .append('xhtml:div')
        /* styling identical to ScrollStage… */
        .text(d.character);

    // Bio box
    d3.select(this.$refs.scatter)
      .append('foreignObject')
        .attr('class','hover-tooltip bio')
        /* etc… same as ScrollStage */;
  },

  clearCharacterTooltip() {
    d3.select(this.$refs.scatter).selectAll('.hover-tooltip').remove();
  },
    onLegendClick(idx) {
    // toggle: click same legend twice to reset
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

      // draw axes through the 0.5 midpoints
      // bottom axis
const xAxisG = chart.append('g')
  .attr('transform', `translate(0, ${yScale(0.5)})`)
  .call(d3.axisBottom(xScale))
  // recolor the domain line and tick lines:
  xAxisG.selectAll('path, line')
    .attr('stroke', 'white')
    .style('stroke-width', 3)

  xAxisG.selectAll('text')   
  .attr('font-family', 'Oswald, sans-serif')  
    .style('fill', 'white');

// left axis
const yAxisG = chart.append('g')
  .attr('transform', `translate(${xScale(0.5)}, 0)`)
  .call(d3.axisLeft(yScale))

  yAxisG.selectAll('path, line')
    .attr('stroke', 'white')
    .style('stroke-width', 3)

   yAxisG.selectAll('text')
    .attr('font-family', 'Oswald, sans-serif')
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

      const displayData = this.filterArchetype === null
      ? this.allData
      : this.allData.filter(d => d.archetype === this.filterArchetype);

      // plot *all* characters by those two axes
      
      chart.selectAll('circle')
        .data(displayData)
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
        .attr('x', 20)
        .attr('y', yScale(0.5)-10)
        .attr('text-anchor','start')
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

          d3.select(event.currentTarget)
            .raise()
            .transition().duration(100)
            .attr('r', 12);

          this.showCharacterTooltip(d);
          

          
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
          d3.select('#tooltip')
            .style('left', event.pageX + 'px')
            .style('top',  event.pageY + 'px');
        })
        .on('mouseout', () => {
          tooltip.classList.remove('visible');
          chart.selectAll('circle')
            .style('opacity',0.8)
            .style('stroke','none');

            d3.select(event.currentTarget)
              .transition().duration(100)
              .attr('r', 8);

            this.clearCharacterTooltip();
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

 .axis-label text {
  fill: white;
}

/* legend */
.legend-container{
  margin-top: 3rem;
}
.legend-item {
  font-family: 'Jaro', sans-serif;
  text-align: left;
  font-size: 24px;
  padding-left: 1rem;
 

}
.legend-item:hover{
  transform: scale(1.2);
}
button{
  width: 150px;
  height: 75px;
}

</style>
