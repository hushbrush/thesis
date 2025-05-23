<template>
  <div class="scrolly-container">
    <div class="background-layer" :class="'bg-step-' + currentStep"></div>

    <div class="graphic" ref="chart"></div>

    <!-- keep it always in the DOM, hide it until step 3 or 4 -->
    <div
      ref="legend"
      class="legend-container"
      v-show="currentStep >= 2"
    ></div>

    <div class="steps">
      <div class="step" data-step="0"></div>
      <div class="step" data-step="1"></div>
      <div class="step" data-step="2"></div>
      <div class="step" data-step="3"></div>
      <div class="step" data-step="4" style="height:120vh"></div>
    </div>

    <div style="height:100vh"></div>
    <div v-if="showArchetypeSection">
      <ArchetypeMicro />
    </div>
  </div>
</template>


<script>
import * as d3 from 'd3'
import scrollama from 'scrollama'
import data from '@/assets/data.json'
import { computeClusterCentersBySize } from '@/utils/clusterSorter.js'
import ArchetypeMicro from '@/components/ArchetypeMicro.vue'

export default {
  components: { ArchetypeMicro },
  emits: ['reached-end'],

  data() {
    return {
      nodes: data,
      showArchetypeSection: false,
      width: window.innerWidth,
      height: window.innerHeight,
      currentStep: 0,
      svg: null,
      simulation: null,
      node: null,
      hoveredNode: null

    }
  },

  mounted() {
    console.log('[ScrollStage] mounted, currentStep =', this.currentStep);
    if (!this.$clusterMeta) {
      console.warn('⚠️ $clusterMeta is not defined! Check main.js')
    }

    this.svg = d3.select(this.$refs.chart)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)

    this.drawInitialNodes()
    this.setupScrollama()
  },

  methods: {
    ticked() {
      const isTimeline = this.currentStep === 3;
    this.node
      .attr('cx', d => d.x)
      .attr('cy', d => isTimeline ? d.y - 20 : d.y);
    },

    drawInitialNodes() {
      this.createLabels()
      this.createNodes()
      this.createSimulation()
    },

    createLabels() {
  const centers = computeClusterCentersBySize(
    this.nodes,
    this.width * 6 / 7,
    this.height,
    220
  );
  // remove old labels
  this.svg.selectAll('.cluster-label').remove();

  // capture metadata and line-height for wrapping
  const clusterMeta = this.$clusterMeta;
  const lineHeight = 1.1; // em units

  // add new labels
  this.svg
    .selectAll('text.cluster-label')
    .data(centers)
    .enter()
    .append('text')
    .attr('class', 'cluster-label')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y - 300)
    .attr('text-anchor', 'middle')
    .attr('fill', (d, i) => clusterMeta[i]?.color || 'white')
    .attr('font-size', 36)
    .attr('font-family', 'jaro')
    .each(function (d, i) {
      const name = (clusterMeta[i]?.name || '').trim();
      const words = name.split(/\s+/);
      const textElem = d3.select(this);

      if (words.length > 1) {
        // multi-word: split into tspans and vertically center
        words.forEach((word, idx) => {
          textElem
            .append('tspan')
            .attr('x', d.x)
            .attr(
              'dy',
              idx === 0
                ? `${-((words.length - 1) / 2) * lineHeight}em`
                : `${lineHeight}em`
            )
            .text(word);
        });
      } else {
        // single word: just set text
        textElem.text(name);
      }
    });

  // add silhouettes
  this.svg
    .selectAll('image.silhouette')
    .data(centers)
    .enter()
    .append('image')
    .attr('class', 'silhouette')
    .attr(
      'href',
      (d, i) => new URL(
        `/src/assets/silhouettes/${i}.svg`,
        import.meta.url
      ).href
    )
    .attr('x', (d) => d.x - 150)
    .attr('y', (d) => d.y - 250)
    .attr('width', 300)
    .attr('height', 100);
},


    createNodes() {
      this.node = this.svg.selectAll('circle')
        .data(this.nodes)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', d => this.$clusterMeta[d.archetype]?.color || 'white')
        .attr('opacity', 0.9)

      
    },

   

    createSimulation() {
      this.simulation = d3.forceSimulation(this.nodes)
        .force('x', d3.forceX().strength(0.7))
        .force('y', d3.forceY().strength(0.7))
        .force('collision', d3.forceCollide(10))
        .force('charge', d3.forceManyBody().strength(-10))
        .alphaDecay(0.02)
        .velocityDecay(0.5)
        .on('tick', this.ticked)
    },

    setupScrollama() {
    const scroller = scrollama()
      .setup({ step: '.step', offset: 0.7 })
      .onStepEnter(({ index }) => {
        this.currentStep = index;
        this.updateLayout(index);

        if (index === 4) {
            console.log('[ScrollStage] about to emit reached-end');
            setTimeout(() => {
              this.$emit('reached-end')})}
      })
      .onStepExit(({ index, direction }) => {
        // if we're scrolling up out of step N, go back to N-1
        if (direction === 'up') {
          const prev = index - 1;
          this.currentStep = prev;
          this.updateLayout(prev);
        }
      });
  },
    showCharacterTooltip(d, place) {
  const estimatedWidth = Math.max(
    d.character.split(/\s+/).reduce((acc, word) => acc + word.length * 14, 0) + 40,
    280
  );
  var distNormaliser = 10;
      if(place !='nameList'){
         // Character Name
      this.svg.append('foreignObject')
      .attr('class', 'hover-tooltip name')
      .attr('x', d.x )
      .attr('y', d.y+distNormaliser)
      .attr('width', estimatedWidth)
      .attr('height', 140)
      .append('xhtml:div')
        .style('background', 'black')
        .style('border', `2px solid ${this.$clusterMeta[d.archetype].color}`)
        .style('border-radius', '15px')
        .style('text-align', 'center')
        .style('padding', '4px')
        .style('font-family', 'Jaro')
        .style('color', this.$clusterMeta[d.archetype].color)
        .style('font-size', '40px')
        .text(d.character);
      }
 

  // Bio Tooltip
  this.svg.append('foreignObject')
    .attr('class', 'hover-tooltip bio')
    .attr('x', d.x -estimatedWidth/2)
    .attr('y', d.y +distNormaliser*10)
    .attr('width', estimatedWidth * 2)
    .attr('height', 300)
    .append('xhtml:div')
      .style('min-width', '280px')
      .style('background', 'black')
      .style('border', `2px solid ${this.$clusterMeta[d.archetype].color}`)
      .style('border-radius', '15px')
      .style('padding', '14px')
      .style('font-family', 'Jura, sans-serif')
      .style('color', this.$clusterMeta[d.archetype].color)
      .style('font-size', '18px')
      .style('line-height', '1.4')
      .style('white-space', 'normal')
      .html(`
        <div style="margin-top: 8px;">${d.bio || ''}</div>
        <div style="margin-top: 12px;">${d.title || 'Unknown'}</div>
        <div style="margin-top: 4px;">Translated by ${d.translator || 'Unknown'}</div>
      `);
},

    clearCharacterTooltip() {
      this.svg.selectAll('.hover-tooltip').remove();
    },

    drawNameBoxes() {
  const centers = computeClusterCentersBySize(
    this.nodes,
    this.width * 6/7,
    this.height,
    220
  );
  // redraw your silhouettes & labels on top
  this.createLabels();

  // hide the circles until step 1
  this.svg.selectAll('circle').attr('display','none');
  // clear old boxes
  this.svg.selectAll('.name-item').remove();

  const estimateWidth = txt => {
  const words = txt.split(/\s+/)
  if (words.length > 1) {
    // add extra space between words and pad more generously
    return words.reduce((acc, word) => acc + word.length * 14, 0) + (words.length - 1) * 18 + 40
  } else {
    // single word — the original logic with a tiny bump
    return txt.length * 15 + 24
  }
}


  const boxH        = 35;    // height of each name‐box
  const yOffset     = 240;  // how far below the silhouette they start

  // build one <g> per character
  const items = this.svg.selectAll('g.name-item')
    .data(this.nodes, d => d.character)
    .enter()
    .append('g')
      .attr('class', 'name-item')
      .attr('opacity', 0);

  // black fill + colored stroke, rounded corners
  items.append('rect')
    .attr('width',  d => estimateWidth(d.character))
    .attr('height', boxH)
    .attr('rx',      10)                           // <-- corner radius
    .attr('ry',      10)                           // <-- corner radius
    .attr('fill',    'black')
    .attr('stroke',  d => this.$clusterMeta[d.archetype].color)
    .attr('stroke-width', 1);

  // white text, colored fill
  items.append('text')
    .attr('x',         d => estimateWidth(d.character)/2)
    .attr('y',        boxH - 8)
    .attr('font-size', 28)
    .attr('font-family','Jaro')
    .attr('fill',     d => this.$clusterMeta[d.archetype].color)
    .attr('text-anchor', 'middle')
    .text(d => d.character);

  // fade the boxes in
  items.transition().duration(100).attr('opacity', 1);

  items
  .on('mouseover', (event, d) => {
    this.hoveredNode = d
    d3.select(event.currentTarget).raise().transition().duration(200)
      .attr('transform', `translate(${d.x - 10},${d.y - 10}) scale(2)`)

    this.showCharacterTooltip(d, 'nameList')

    this.nameSim
    .force('collision', d3.forceCollide(n => n === this.hoveredNode ? 60 : boxH / 2 + 10))
    .alpha(0.002)
    .restart()

})
.on('mouseout', (event, d) => {
  this.clearCharacterTooltip()

d3.select(event.currentTarget)
  .transition().duration(200)
  .attr('transform', `translate(${d.x}, ${d.y}) scale(1)`)




this.nameSim
  .force('collision', d3.forceCollide(boxH / 2 + 10))
  .alpha(0.002)
  .restart()

})




  // seed every node right under its silhouette
  this.nodes.forEach(d => {
    d.x = centers[d.archetype].x;
    d.y = centers[d.archetype].y + yOffset;
  });

  // tear down any old sim
  if (this.nameSim) this.nameSim.stop();

  // brand‐new mini‐simulation:
  this.nameSim = d3.forceSimulation(this.nodes)
    .force('x', d3.forceX(d => centers[d.archetype].x).strength(1.5))
    // *weaker* y‐pull so collisions spread them vertically
    .force('y', d3.forceY(d => centers[d.archetype].y + yOffset-95).strength(0.6))
    // padding = half box‐height + 10px → you’ll get ~3× more vertical room
    .force('collision', d3.forceCollide(boxH/2 + 10))
    .alpha(1).alphaDecay(0.05)
    .on('tick', () => {
      items.attr('transform', d => `translate(${d.x}, ${d.y}) scale(${this.hoveredNode === d ? 1.5 : 1})`)      ;
    });
},


    updateLayout(index) {
        // wipe out any old labels / boxes / timeline
        if (this.$refs.legend) {
          d3.select(this.$refs.legend).selectAll('*').remove();
        }


        this.svg.selectAll(
      '.cluster-label, .timeline-line, .timeline-text, ' +
      '.uncertainty, .silhouette, .name-item'
    ).remove()

        // now branch on the new step numbering
        if (index === 0) {
          this.drawNameBoxes();               
        }
        // step 1: morph into your circles
        else if (index === 1) {
          // grab box‐simulation final positions…
          // (they’ve been mutating this.nodes[][x,y] already)

          // fade out the boxes if any still linger
          this.svg.selectAll('g.name-item')
            .transition().duration(200).attr('opacity', 0)
            .remove();

          // show circles exactly at the same x,y
          this.svg.selectAll('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('display','block');

          // now run your normal cluster simulation
          this.drawClusterLayout();
        }

        else if (index === 2) {
          this.drawMapLayout();
          this.legendMaker()
        }
        else if (index === 3) {
          this.drawTimelineLayout();
          this.$nextTick(() => this.legendMaker());
        }
        else if (index === 4) {
          this.$nextTick(() => {
       console.log("we should be moving soon")
      });
          // your existing “emit reached-end” logic lives in setupScrollama
        }
      },

      legendMaker() {
    const container = d3.select(this.$refs.legend);
    container.selectAll('*').remove();  // clear any old legend

    const archetypes = Object.values(this.$clusterMeta);
    archetypes.forEach(a => {
      const item = container.append('div').attr('class','legend-item');
      item.append('div')
          .attr('class','swatch')
          .style('background', a.color);
      item.append('span')
          .text(a.name)
          .style('color', a.color)
          .style('font-size','28px')
          .style('font-family','Jaro');
    })},
    drawClusterLayout() {
      const centers = computeClusterCentersBySize(this.nodes, this.width*6/7, this.height+100, 220)
      this.createLabels()

      this.nodes.forEach(d => {
        d.x = centers[d.archetype].x;
        d.y = centers[d.archetype].y;
      });


      this.simulation
  .force('x', d3.forceX(d => centers[d.archetype]?.x).strength(0.6))
  .force('y', d3.forceY(d => centers[d.archetype]?.y).strength(0.6))
  .alpha(0.8)
  .alphaDecay(0.03)
  .velocityDecay(0.5)
  .restart()
  
  this.nodesSettled = false;
setTimeout(() => {
  this.nodesSettled = true;
}, 1000); // do I need to add an if settled the pointer event none?


      // Create hoverable behavior for circles
this.node = this.svg.selectAll('circle')
  .data(this.nodes, d => d.character)
  .join('circle')
  .attr('r', 10)
  .attr('fill', d => this.$clusterMeta[d.archetype]?.color || 'white')
  .attr('opacity', 0.9)
  .on('mouseover', (event, d) => {
    this.hoveredNode = d

    d3.select(event.currentTarget)
      .raise()
      .transition().duration(200)
      .attr('r', 16)

    this.showCharacterTooltip(d, 'cluster')

    this.simulation
      .force('collision', d3.forceCollide(n => n === d ? 30 : 10))
      .alpha(0.03)
      .restart()
  })
  .on('mouseout', (event, d) => {
    this.hoveredNode = null

    d3.select(event.currentTarget)
      .transition().duration(200)
      .attr('r', 10)

    this.svg.selectAll('.hover-tooltip').remove()

    this.simulation
      .force('collision', d3.forceCollide(10))
      .alpha(0.03)
      .restart()
  })



    },

    drawMapLayout() {
      const projection = d3.geoMercator()
        .center([0, 20])
        .scale(this.width / 6.5)
        .translate([this.width / 2, this.height / 2])

        this.simulation
  .force('x', d3.forceX(d => projection([d.lon, d.lat])[0]).strength(0.3))
  .force('y', d3.forceY(d => projection([d.lon, d.lat])[1]).strength(0.3))
  .alpha(0.8)            // strong initial movement
  .alphaDecay(0.05)     // SLOW decay — longer visible motion
  .velocityDecay(0.5)   // floatier movement, not snappy
  .restart()

  // this.legendMaker();

      
    },


    drawTimelineLayout() {
  this.simulation.stop()

  let margin_timeline = 80;
  // 1. compute your time extent & X‐scale
  const timeExtent = d3.extent(this.nodes, d => +d.original_date || 0)
  const xScale = d3.scaleLinear()
    .domain([timeExtent[0] - 100, timeExtent[1] + 100])
    .range([100, this.width - 100])

  // 2. determine your Y‐extent (for the Y-axis)
  //    I'll assume you want it to span from just above your highest‐stacked node
  //    down to the bottom margin (height - 40). Adjust minY as needed.
  const maxStackCount = d3.max(Array.from(this.nodes.reduce((m, d) => {
    const x = xScale(d.original_date)
    const c = (m.get(x) || 0) + 1
    m.set(x, c)
    return m
  }, new Map()).values()))
  const baseY = this.height -margin_timeline
  const minY = baseY - (maxStackCount - 1) * 10  // spacing = 10
  const yScale = d3.scaleLinear()
    .domain([minY, this.height -margin_timeline])
    .range([minY, this.height -margin_timeline])

  // 3. draw & style the bottom (X) axis
  const xAxisG = this.svg.append('g')
    .attr('transform', `translate(0, ${this.height -margin_timeline})`)
    .call(d3.axisBottom(xScale))
  xAxisG.selectAll('text')
    .style('fill', 'white')
    .style('font-family', 'Jaro, sans-serif')
    .style('font-size', 28)


  xAxisG.selectAll('path, line')
     .attr('y2', 8)
    .style('stroke', 'white')
    .style('stroke-width', 3)




  // 5. your existing “zero” reference line + label
  this.svg.append("line")
    .attr("class", "timeline-line")
    .attr("x1", xScale(0))
    .attr("x2", xScale(0))
    .attr("y1",margin_timeline/3)
    .attr("y2", this.height -margin_timeline)
    .style("stroke", "white")
    .style("stroke-width", 8)
    .style("stroke-dasharray", "4 4")
    .style('opacity', 0.5)

  this.svg.append("text")
    .attr("class", "timeline-text")
    .attr("x", xScale(0) + 8)
    .attr("y", margin_timeline+20)
    .text("Birth of Christ")
    .style("fill", "white")
    .style("font-size", "28px")
    .style("font-family", "Jaro")
    .style('opacity', 0.8)

  // 6. build your uncertainty bars & stack‐positions exactly as before
  const stackMap = new Map()
  const spacing = 20
  const nodePositions = []

  for (const d of this.nodes) {
    const x = xScale(d.original_date)
    const count = stackMap.get(x) || 0
    const y = baseY - count * spacing
    stackMap.set(x, count + 1)

    this.svg.append("rect")
      .attr("class", "uncertainty")
      .attr("x", xScale(d.original_date - d.date_range_confidence))
      .attr("y", y - 30)
      .attr("width", xScale(d.original_date + d.date_range_confidence) - xScale(d.original_date - d.date_range_confidence))
      .attr("height", 18)
      .attr("fill", this.$clusterMeta[d.archetype]?.color || '#888')
      .attr("opacity", 0.2)
      .attr("rx", 10)
      

    nodePositions.push({ ...d, x, y })
  }

  // 7. transition your circles to their new X/Y
  this.node
    .data(nodePositions, d => d.character)
    .transition()
    .duration(1700)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y-20)

    // this.legendMaker();
},
legendMaker() {
    // clear any old legend
    const container = d3.select(this.$refs.legend);
   

    // 7 archetypes from your clusterMeta
    const archetypes = Object.values(this.$clusterMeta);
    console.log(archetypes)

    // one legend‐item per archetype
    archetypes.forEach(a => {
      const item = container.append('div')
        .attr('class', 'legend-item');

      item.append('div')
        .attr('class', 'swatch')
        .style('background', a.color || 'white');

      item.append('span')
        .text(a.name)
        .style('color', a.color)
        .style('text-align', 'left');
    });

    // confidence‐scale swatch + label
    const conf = container.append('div')
      .attr('class', 'confidence');

    conf.append('div')
      .attr('class', 'swatch');
    conf.append('span')
      .text("Date Variation");
  },
  }
}
</script>

<style scoped>


#tooltip {
  max-width: 300px;
  position: absolute;       /* so left/top take effect */
  display: none;            /* your JS will toggle this */
  background: #000000dd;
  padding: 6px 10px;
  font-size: 16px;
  border-radius: 6px;
  pointer-events: all;     /* don’t steal pointer events */

  z-index: 6;           /* on top of everything */
}

.scrolly-container {
  position: relative;
  overflow: visible;  /* let the parent sections-wrapper scroll */
  width: 100%;
}


.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: background 0.5s;
}

.bg-step-0 { background: black; }
.bg-step-1 { background: black; }
.bg-step-2 { background-image: url('@/assets/world_map.png'); background-color: black; }
.bg-step-3 { background: black; }
.bg-step-4 { background: black; }
.graphic {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  background: transparent;
  
}

.steps {
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.step {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}
.step[data-step="3"] {
  height: 120vh;
  background: black;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step[data-step="0"] {
  height: 140vh;
 
}
.global-tooltip {
  max-width: 300px;
  position: absolute;
  display: none;
  background: #000000dd;
  padding: 6px 10px;
  font-size: 16px;
  border-radius: 6px;
  pointer-events: none;
  color: white;
  z-index: 5;
}



/* legend */
.legend-container {
  position: fixed;
  
  top: 50px;
  right: 20px;
  width: 200px;
  height: 200px;;
  pointer-events: auto;    /* let clicks pass through to SVG if you like */
  z-index: 10;
  font-family: jaro;
  color: white;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.6);
  text-align: left;
 
}

.legend-container .legend-item .swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  /* flex-shrink: 0; */
}
.legend-container ::v-deep .confidence {
  margin-top: 36px;
  border-radius: 20px;
  /* a left→right gradient through your seven colors at 10% opacity */
  background: linear-gradient(
    90deg,
    rgba(171,217,22,0.5)   0%,
    rgba(28,230,213,0.5)  16.7%,
    rgba(249,198,79,0.5)  33.3%,
    rgba(255,0,136,0.5)   50%,
    rgba(245,159,242,0.5) 66.7%,
    rgba(219,243,157,0.5) 83.3%,
    rgba(250,131,57,0.5) 100%
  );
}


.legend-container ::v-deep span {
  
  font-size: 24px;
  text-align: left;
  padding-left:12px;
  padding-bottom: 0px;
  line-height: 25px;

}

.uncertainty{
  z-index: 0;
}
</style>
