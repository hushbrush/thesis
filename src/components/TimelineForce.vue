<template>
    <div class="timeline-container" ref="chart"></div>
    <div class="tooltip" ref="tooltip"></div>
  </template>
  
  <script>
  import * as d3 from 'd3'
  import data from '@/assets/data.json'
  
  export default {
    name: 'TimelineForce',
    props: ['nodes'],
    data() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    mounted() {
      this.createTimelineChart()
    },
    methods: {
      createTimelineChart() {
        const svg = d3.select(this.$refs.chart)
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
  
        const tooltip = this.$refs.tooltip
  
        // Scale for time
        const timeExtent = d3.extent(this.nodes, d => +d.original_date || 0)
        const xScale = d3.scaleLinear()
          .domain(timeExtent)
          .range([100, this.width - 100])
  
        const simulation = d3.forceSimulation(this.nodes)
          .force('x', d3.forceX(d => xScale(+d.original_date || 0)).strength(0.7))
          .force('y', d3.forceY(this.height / 2).strength(0.1))
          .force('collision', d3.forceCollide(d => d.size || 10))
          .force('charge', d3.forceManyBody().strength(-10))
          .on('tick', ticked)
  
        const node = svg.selectAll('circle')
          .data(this.nodes)
          .enter()
          .append('circle')
          .attr('r', d => d.size / 1.1 || 10)
          .attr('fill', '#ff94d6')
          .attr('opacity', 0.85)
  
        node.on('mouseover', function (event, d) {
          d3.select(this).attr('stroke', 'white').attr('stroke-width', 2)
          tooltip.style.display = 'block'
          tooltip.innerText = d.character
        })
          .on('mousemove', function (event) {
            tooltip.style.left = `${event.pageX + 10}px`
            tooltip.style.top = `${event.pageY - 20}px`
          })
          .on('mouseout', function () {
            d3.select(this).attr('stroke', null)
            tooltip.style.display = 'none'
          })
  
        function ticked() {
          node.attr('cx', d => d.x).attr('cy', d => d.y)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .timeline-container {
    width: 100vw;
    height: 100vh;
    background: #000;
    position: relative;
  }
  
  .tooltip {
    position: absolute;
    display: none;
    background: #ffffffdd;
    color: black;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 6px;
    pointer-events: none;
    font-family: 'Merriweather', serif;
    z-index: 10;
  }
  </style>
  