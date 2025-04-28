<template>
    <div class="map-container" ref="chart"></div>
    
  </template>
  
  <script>
  import * as d3 from 'd3'
  import data from '@/assets/data.json'
  
  export default {
    name: 'MapForce',
    props: ['nodes'],
    emits: ['next'],
    data() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    },
    mounted() {
      this.createMapChart()
    },
    methods: {
      createMapChart() {
        const svg = d3.select(this.$refs.chart)
          .append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
          .style('z-index', 0)
  
        const projection = d3.geoMercator()
          .center([0, 20]) // Center map
          .scale(this.width / 6.5)
          .translate([this.width / 2, this.height / 2])
          
  
        const tooltip = this.tooltip
  
        const simulation = d3.forceSimulation(this.nodes)
          .force('x', d3.forceX(d => {
            const coords = projection([d.lon, d.lat])
            return coords ? coords[0] : this.width / 2
          }).strength(0.8))
          .force('y', d3.forceY(d => {
            const coords = projection([d.lon, d.lat])
            return coords ? coords[1] : this.height / 2
          }).strength(0.8))
          .force('collision', d3.forceCollide(d => d.size || 10))
          .force('charge', d3.forceManyBody().strength(-10))
          .on('tick', ticked)
  
        const node = svg.selectAll('circle')
          .data(this.nodes)
          .enter()
          .append('circle')
          .attr('r', d => d.size / 1.1 || 10)
          .attr('fill', '#7face3')
          .attr('opacity', 0.8)
  
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
  .map-container {
    width: 100vw;
    height: 100vh;
    background: #000;
    position: relative;
  }
  </style>
  