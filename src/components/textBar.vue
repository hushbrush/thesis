<template>
    <div class="quote-bar-with-icon" style="display:flex; align-items:center">
      <svg ref="svg"></svg>
      <div 
        ref="iconContainer" 
        :style="{ width: height + 'px', height: height + 'px', marginLeft: '8px' }"
      ></div>
    </div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'QuotePositionBar',
    props: {
      item:   { type: Object, required: true },
      height: { type: Number, default: 20 }
    },
    computed: {
      silhouetteUrl() {
        try {
          return new URL(
            `../assets/silhouettes/${this.item.archetype}.svg`,
            import.meta.url
          ).href;
        } catch {
          return new URL(`../assets/silhouettes/default.svg`, import.meta.url).href;
        }
      }
    },
    async mounted() {
      const { textLength, quotes_n_loc, archetype } = this.item;
      const meta       = this.$clusterMeta[archetype];
      const quoteColor = meta?.color || 'red';
  
      // 1) draw the bar
      const width  = window.innerWidth / 4;
      const height = this.height;
      const svg = d3.select(this.$refs.svg)
        .attr('width', width)
        .attr('height', height);
  
      svg.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', width).attr('height', height)
        .attr('fill', 'white');
  
      // 2) draw quote segments with hover
      const vm = this;
      quotes_n_loc.forEach(([quoteText, loc]) => {
        if (!quoteText) return;
        const x = (loc / textLength) * width;
        const w = (quoteText.length / textLength) * width;
        svg.append('rect')
          .attr('x', x).attr('y', 0)
          .attr('width', w).attr('height', height)
          .attr('fill', quoteColor)
          .style('cursor', 'pointer')
          .on('mouseover', function() { vm.$emit('hover-quote', quoteText); })
          .on('mouseout',  function() { vm.$emit('hover-quote', ''); });
      });
  
      // 3) inline & color the silhouette
      try {
        const xml = await d3.xml(this.silhouetteUrl);
        const node = document.importNode(xml.documentElement, true);
        d3.select(node)
          .attr('height', height)
          .attr('width', height)
          .selectAll('path')
            .attr('fill', quoteColor)
            .attr('stroke', 'none');
        this.$refs.iconContainer.appendChild(node);
      } catch (err) {
        console.warn('Could not load silhouette SVG:', err);
      }
    }
  };
  </script>
  
  <style scoped>
  svg { display: block; }
  .quote-bar-with-icon div { display: block; }
  </style>
  