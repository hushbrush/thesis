<template>
  <div
    class="quote-bar-with-icon"
    :class="{ reverse: side === 'right' }"
  >
    <svg ref="svg"></svg>
    <div
     
      v-if="showIcon"
      ref="iconContainer"
      class="['icon-container', { mirror: side==='left' }]"
      :style="iconStyle"
    ></div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'QuotePositionBar',
  props: {
    item:   { type: Object, required: true },
    height: { type: Number, default: 20 },
    side:   { type: String, default: 'left' },
    showIcon: { type: Boolean, default: true }
  },
  computed: {
    silhouetteUrl() {
      try {
        return new URL(
          `../assets/silhouettes/${this.item.archetype}.svg`,
          import.meta.url
        ).href;
      } catch {
        return new URL(
          `../assets/silhouettes/default.svg`,
          import.meta.url
        ).href;
      }
    },
    iconStyle() {
      const size = this.height + 'px';
      const style = { width: size, height: size };
      // nudge toward the bar's inner end
      if (this.side === 'left') {
        style.marginLeft = '8px';
      } else {
        style.marginRight = '8px';
      }
      return style;
    }
  },
  async mounted() {
    const { textLength, quotes_n_loc, archetype } = this.item;
    const meta = this.$clusterMeta[archetype];
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

    // 2) draw quote segments
    const vm = this;
    quotes_n_loc.forEach(([quoteText, loc]) => {
      if (!quoteText) return;
      const x = (loc / textLength) * width;
      const w = (quoteText.length / textLength) * width+10;
      svg.append('rect')
        .attr('x', x).attr('y', 0)
        .attr('width', w).attr('height', height)
        .attr('fill', quoteColor)
        .style('cursor', 'pointer')
        .on('mouseover', () => vm.$emit('hover-quote', quoteText))
        .on('mouseout',  () => vm.$emit('hover-quote', ''));
    });

    // 3) inline & color the silhouette
    try {
      const xml  = await d3.xml(this.silhouetteUrl);
      const node = document.importNode(xml.documentElement, true);
      d3.select(node)
        .attr('height', height)
        .attr('width', height)
        .selectAll('path')
          .attr('fill', quoteColor)
          .attr('stroke', 'none');
      this.$refs.iconContainer.appendChild(node);

      if (this.side === 'left') {
        // either on the node itself:
        node.style.transform = 'scaleX(-1)';
        node.style.transformOrigin = 'center center';
        // …or with D3:
        d3.select(node)
          .style('transform', 'scaleX(-1)')
          .style('transform-origin', 'center center');
      }


    } catch (err) {
      console.warn('Could not load silhouette SVG:', err);
    }
  }
};
</script>

<style scoped>
.quote-bar-with-icon {
  display: flex;
  align-items: center;
}

/* if side==='right', reverse the order so icon sits on the left */
.quote-bar-with-icon.reverse {
  flex-direction: row-reverse;
}

svg {
  display: block;
}

.quote-bar-with-icon .icon-container {
  display: block;
}

/* ○ LEFT COLUMN: flip (mirror) the silhouette horizontally so it faces inward */
.quote-bar-with-icon:not(.reverse) .icon-container svg {
  transform: scaleX(-1);
}

/* ○ RIGHT COLUMN: you already have this from before, 
      it lives in the “reverse” class to flip those icons if you wish */
 .quote-bar-with-icon.reverse .icon-container svg {
  transform: scaleY(-1);
}

.icon-container.mirror {
  transform: scaleX(-1);
  transform-origin: center center; /* optional, but explicit */
}
</style>
