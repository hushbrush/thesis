<template>
  <div
    v-if="archetypeIndex !== null"
    class="reveal-layout"
    :style="{ '--highlight-color': clusterMeta[archetypeIndex]?.color || '#fff' }"
  >
    <button class="back-button" @click="$emit('restart-quiz')">
      ← Back to Quiz
    </button>
 
    <!-- General text background -->
    <div class="text-wall general">
      <p class="quote" v-html="filteredQuotes"></p>
    </div>
 
    <img
      class="archetype-outline"
      :src="`src/assets/silhouettes/${archetypeIndex}.svg`"
      alt="Silhouette Outline"
    />
 
    <h1
      :style="{ color: clusterMeta[archetypeIndex].color }"
      class="global-h1"
    >
      The {{ clusterMeta[archetypeIndex].name }}
    </h1>
 
    <button class="continue-button" @click="$emit('continue')">
      Continue to Archetypes →
    </button>
  </div>
 </template>
 
 <script>
 import data from '@/assets/data.json'
 import clusterMeta from '@/utils/clusterMeta.js'
 
 function randInt(min, max) {
  // inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min
}


 export default {
   name: 'ResultReveal',
   emits: ['continue', 'restart-quiz'],
   props: {
     archetypeIndex: { type: Number, required: true }
   },
   mounted() {
  // `this.$el` === the <div class="reveal-layout">
  const highlightColor = getComputedStyle(this.$el)
    .getPropertyValue('--highlight-color')
    .trim();
  console.log('⛰️ highlight-color var is:', highlightColor);
},

   computed: {
    filteredQuotes() {
      // 1) pick only this archetype’s chars
      const matching = data.filter(
        c => Number(c.archetype) === this.archetypeIndex
      )

      // 2) all raw quote-texts
      let allQs = matching.flatMap(c =>
        (c.quotes_n_loc || []).map(([text]) => text)
      )

      // 3) clean & dedupe
      let pool = Array.from(new Set(
        allQs
          .filter(q => typeof q === 'string' && q.trim())
          .map(q => q.trim())
      ))

      // 4) shuffle pool
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pool[i], pool[j]] = [pool[j], pool[i]]
      }

      // 5) pull out your two highlights
      const rawHighlights =
        this.clusterMeta[this.archetypeIndex].highlight_quotes || []

      // normalize highlight-quotes so we match exactly
      const hq1 = rawHighlights[0]?.trim()
      const hq2 = rawHighlights[1]?.trim()

      // remove them from the pool if present
      pool = pool.filter(q => q !== hq1 && q !== hq2)

      // 6) pick random insertion slots
      //    ensure we don’t go out of bounds if pool is small
      const slot1 = Math.min(randInt(0, 1), pool.length)
      const slot2 = Math.min(randInt(2, 6), pool.length + 1)

      // 7) splice them in
      const finalList = [...pool]
      if (hq1) finalList.splice(slot1, 0, hq1)
      if (hq2) finalList.splice(slot2, 0, hq2)

      // 8) render spans, highlighting only those two
      return finalList
        .map(q => {
          const isHQ = (q === hq1 || q === hq2)
          return `<span class="${isHQ ? 'highlight' : ''}">${q}</span>`
        })
        .join(' ')
    },
 
     clusterMeta() {
       return clusterMeta
     }
   }
 }
 </script>
 
 <style scoped>
 .text-wall {
   position: absolute;
   inset: 0;
   padding: 40px;
   font-family: 'Oswald', sans-serif;
   font-size: 20px;
   line-height: 1.7;
   font-weight: 500;
   z-index: 1;
   color: #fff;
   overflow-y: auto;
   word-break: break-word;
 }
 
 .quote {
   margin: 0;
   color: #525252;
 }
 
 .quote ::v-deep(.highlight)  {
   /* uses the archetype’s color via the CSS var */
   color: var(--highlight-color);
 }
 
 .reveal-layout {
   position: relative;
   width: 100vw;
   height: 100vh;
   background: black;
   overflow: hidden;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   /* default highlight-color if clusterMeta is missing */
   --highlight-color: red;
 }
 
 .archetype-outline {
   position: relative;
   z-index: 3;
   top: 150px;
   height: 80%;
   pointer-events: none;
   margin: 10px;
 }
 
 .back-button,
 .continue-button {
   background-color: #fff;
   color: #000;
   border: none;
   font-size: 18px;
   cursor: pointer;
   z-index: 4;
 }
 .back-button {
   position: absolute;
   top: 20px;
   left: 20px;
 }
 .continue-button {
   position: absolute;
   bottom: 20px;
   right: 20px;
 }
 
 .global-h1 {
   font-family: jaro;
   font-size: 150px;
   padding: 10px;
   z-index: 3;
 }
 </style>
 