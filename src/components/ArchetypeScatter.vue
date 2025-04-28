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
      </div>
      
    </div>
  </div>
</template>

  
  <script>
  import * as d3 from 'd3';
  import data from '@/assets/data.json';
  import { allCharacteristics } from '@/assets/characteristics.js';
  
  //THIS CHART NEEDS A LEGEND REALLY BADLY.

  export default {
    props: {
      selectedArchetype: Number,
      clusterMeta: Array
    },
    data() {
      return {
        zoomed: false, 
        chartWidth: window.innerWidth*4/5,
        chartHeight: window.innerHeight * 2/3,
        allData: data
      };
    },
    watch: {
  selectedArchetype: {
    handler() {
      this.updateScatter();
    },
    immediate: true
  },
  zoomed: {
    handler() {
      this.updateScatter(); // 👈 redraw chart when zoom changes!
    }
  }
},

    methods: {
      updateScatter() {
        const svg = d3.select(this.$refs.scatter);
        svg.selectAll('*').remove();
  
        const margin = { top: 20, right: 60, bottom: 60, left: 60 };
        const width = this.chartWidth - margin.left - margin.right;
        const height = this.chartHeight - margin.top - margin.bottom;
  
        const chart = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
  
          const xScale = d3.scaleLinear()
            .domain(this.zoomed ? [0.5, 1] : [0, 1]) 
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(this.zoomed ? [0, 1] : [0, 1]) 
            .range([height, 0]);

  
       
        chart.append('g')
        .attr('transform', `translate(0, ${yScale(0.5)})`) 
        .call(d3.axisBottom(xScale));

        // Y Axis: move to center width (x = 0.5)
        chart.append('g')
        .attr('transform', `translate(${xScale(0.5)}, 0)`) 
        .call(d3.axisLeft(yScale));


  
        // Find most important characteristics for selected archetype
        const archetypeCharacters = this.allData.filter(d => d.archetype === this.selectedArchetype);
  
        const averages = {};
        allCharacteristics.forEach(char => {
          const total = archetypeCharacters.reduce((sum, d) => {
            const charMap = new Map(d.characteristics);
            return sum + (charMap.get(char) || 0);
          }, 0);
          averages[char] = total / archetypeCharacters.length;
        });
      
        //now trying highest and second highest:
        // Sort all characteristics by their average score, descending
        const sortedCharacteristics = Object.keys(averages).sort((a, b) => averages[b] - averages[a]);

        const highestCharacteristic = sortedCharacteristics[0];      // 🥇 highest
        const lowestCharacteristic = sortedCharacteristics[sortedCharacteristics.length-1]; // 🥈 second highest


        // Now plot ALL characters by those two characteristics
        chart.selectAll('circle')
          .data(this.allData)
          .enter()
          .append('circle')
          .attr('cx', d => {
            const charMap = new Map(d.characteristics);
            return xScale(charMap.get(highestCharacteristic) || 0);
          })
          .attr('cy', d => {
            const charMap = new Map(d.characteristics);
            return yScale(charMap.get(lowestCharacteristic) || 0);
          })
          .attr('r', 8)
          .attr('fill', d => this.clusterMeta[d.archetype]?.color || 'white')
          .style('opacity', 1);
          


        // Add X Axis Label (highestCharacteristic)
        chart.append('text')
        .attr('class', 'axis-label') 
        .attr('x', width - 10)
        .attr('y', yScale(0.5) - 10)
        .attr('text-anchor', 'end')
        .text(highestCharacteristic);

        // Add Y Axis Label (lowestCharacteristic)
        chart.append('text')
        .attr('class', 'axis-label') 
        .attr('x', xScale(0.5) + 10)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .text(lowestCharacteristic);

                // Setup tooltip (assumes you have <div id="tooltip"></div> somewhere globally)
        const tooltip = document.getElementById('tooltip');

        // Add event listeners to circles
        chart.selectAll('circle')
            .on('mouseover', function(event, d) {
                const charMap = new Map(d.characteristics);

                tooltip.classList.add('visible');
                tooltip.innerHTML = `
                <div style="font-weight: bold; font-size: 20px; margin-bottom: 6px;">
                    ${d.character}
                </div>
                <div style="font-size: 14px; margin-bottom: 4px;">${highestCharacteristic} Score: ${(charMap.get(highestCharacteristic) * 100).toFixed(0)}%</div>
                <div style="font-size: 14px; margin-bottom: 4px;">${lowestCharacteristic} Score: ${(charMap.get(lowestCharacteristic) * 100).toFixed(0)}%</div>
                <div style="font-size: 14px;">${d.bio}</div>
                <div style="font-style: italic; font-size: 14px;">${d.title}</div>
                `;

                // Dim all circles
                chart.selectAll('circle')
                .style('opacity', 0.1);

                // Highlight only hovered one
                d3.select(this)
                .style('stroke', 'white' )
                .style('stroke-width', 2);

                //highlighting all of the same archetype
                chart.selectAll('circle')
                    .filter(d2 => d2.archetype === d.archetype)
                    .style('opacity', 1);

               



            })
            .on('mousemove', function(event) {
                tooltip.style.left = `${event.pageX + 12}px`;
                tooltip.style.top = `${event.pageY - 30}px`;
            })
            .on('mouseout', function() {
                tooltip.classList.remove('visible');
                chart.selectAll('circle')
                .style('opacity', 0.8)
                .style('stroke', 'none' );

                
            });



      }
    }
  }
  </script>
  
  <style scoped>
.scatter-container {
  background: black;
  padding: 2rem;
}

.scatter-layout {
  display: flex;
  align-items: center; /* vertically center */
  justify-content: space-between;
}

.chart-section {
  flex: 1; /* chart takes most space */
}

.right-section {
  margin-left: 2rem; /* some spacing */
}

.zoom-button {
  background: rgba(255,255,255,0.1);
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 18px;
  font-family: Jaro;
  border-radius: 10px;
  cursor: pointer;
  z-index: 100;
}

.zoom-button:hover {
  background: white;
  color: black;
}

  .zoom-button {
  left: 0;
  top: 2rem;
  right: 2rem;
  background: rgba(255,255,255,0.1);
  border: 2px solid white;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 18px;
  font-family: Jaro;
  border-radius: 10px;
  cursor: pointer;
  z-index: 100;
  transition: zoom 0.3s;
}
.zoom-button:hover {
  background: white;
  color: black;
}

  </style>
  <!-- can make the cells rounded edges -->
   <!-- should make the tooltips only work as long as I am on something, remove the last tooltip. -->
    <!-- have to correct the timeline obv. and hope it gets better once I am done with all the data. -->