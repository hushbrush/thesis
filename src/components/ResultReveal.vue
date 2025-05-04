<template>
 <div v-if="archetypeIndex !== null" class="reveal-layout" 
 :style="{ '--highlight-color': clusterMeta[archetypeIndex]?.color || '#fff' }">
    <button class="back-button" @click="$emit('restart-quiz')">← Back to Quiz</button>

    <!-- General text background -->
    <div class="text-wall general">
      <p class="quote" v-html="filteredQuotes"></p>
    </div>

    <!-- Masked red text -->
    <!-- <div class="text-wall inside" >
      <p class="quote" v-html="filteredQuotes"></p>
    </div> -->

    <!-- Optional: red SVG outline glow -->
    <img
      class="archetype-outline"
      :src="`src/assets/silhouettes/${archetypeIndex}.svg`"
      
      alt="Silhouette Outline"
    />
  

    <h1 :style="{ color: clusterMeta[archetypeIndex].color }" class="global-h1">The
  {{ clusterMeta[archetypeIndex].name }}
</h1>


    <button class="continue-button" @click="$emit('continue')">
      Continue to Archetypes →
    </button>
  </div>
</template>

<script>
import data from '@/assets/data.json'
import clusterMeta from '@/utils/clusterMeta.js'


export default {
  name: 'ResultReveal',
  emits: ['continue', 'restart-quiz'],
  props: {
  archetypeIndex: {
    type: Number,
    required: true
  }
},
beforeMount() {
  if (this.archetypeIndex == null) {
    // Bail out early so render() never runs
    return;
  }
},
mounted() {
 
},

computed: {
  
  filteredQuotes() {
    // 1) only characters matching the archetype
    const matching = data.filter(c => Number(c.archetype) === this.archetypeIndex);

    // 2) pull out just the text from each [quote, loc] pair
    const allQs = matching.flatMap(c =>
      (c.quotes_n_loc || []).map(([text, /* loc */]) => text)
    );

    // 3) clean up and drop empty
    const result = allQs
      .filter(q => typeof q === 'string' && q.trim().length > 0)
      .map(q => q.trim());

    

    // 4) shuffle in-place
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    // 5) wrap every 7th in a highlight span
    const html = result
      .map((q, i) => `<span class="${(i + 1) % 7 === 0 ? 'highlight' : ''}">${q}</span>`)
      .join(' ');

    console.log('🔗 filteredQuotes HTML:', html);
    return html;
  },


    clusterMeta() {
      return clusterMeta;
    }
  }
}
</script>

<style scoped>

.text-wall {
position: absolute;
inset: 0;
padding: 40px;
font-family: 'Merriweather', serif;
font-size: 18px;
line-height: 1.7;
z-index: 1;
color: #fff;
overflow-y: auto;
word-break: break-word;
}

.quote {
margin: 0;
color: #525252;
}

.quote .highlight {
color: var(--highlight-color);
}

.inside {
z-index: 2;
}


.reveal-layout {
position: relative;
width: 100vw;
height: 100vh;
background: black;
overflow: hidden;
--highlight-color: red;
display: flex;               
flex-direction: column;     
align-items: center;        
justify-content: center;    
}


.archetype-outline {
z-index: 3;
top: 150px;
height: 80%;
width: auto;
z-index: 3;
pointer-events: none;
margin: 10px;
position: relative;          /* 🔥 CHANGE from absolute to relative */
}


.back-button {
  background-color: #fff;
  color: #000;

position: absolute;
top: 20px;
left: 20px;
border: none;
font-size: 18px;
cursor: pointer;
z-index: 4;
}
.continue-button {
  background-color: #fff;
  color: #000;
position: absolute;
bottom: 20px;
right: 20px;
border: none;
font-size: 18px;
cursor: pointer;
z-index: 4;
}

h1 {
font-family: jaro;
font-size: 150px;
padding: 10px;
z-index: 3;
}

.text-wall.general .quote {
color: rgba(255,255,255,0.7);  /* light ghost text behind */
}
.text-wall.inside .quote {
color: var(--highlight-color);
opacity: 0.9;   /* you can dial this down if it’s too solid */
}

</style>
