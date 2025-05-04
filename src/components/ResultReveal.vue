<template>
 <div v-if="archetypeIndex !== null" class="reveal-layout" 
 :style="{ '--highlight-color': clusterMeta[archetypeIndex]?.color || '#fff' }">
    <button class="back-button" @click="$emit('restart-quiz')">← Back to Quiz</button>

    <!-- General text background -->
    <div class="text-wall general">
      <p class="quote" v-html="filteredQuotes"></p>
    </div>

    <!-- Masked red text -->
    <div class="text-wall inside" style="clip-path: url(#silhouette-mask);">
      <p class="quote" v-html="filteredQuotes"></p>
    </div>

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
}
,
  computed: {
    filteredQuotes() {
      const result = data
        .filter(char => char.archetype === this.archetypeIndex)
        .flatMap(char => (char.quotes || []))
        .flatMap(q => Array.isArray(q) ? q : [q])
        .filter(q => typeof q === 'string' && q.trim().length > 0)
        .map(q => q.trim());

      // Shuffle
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }

      // Join as spans, every 7th with special class
      return result
        .map((q, i) => {
          const cls = (i + 1) % 7 === 0 ? 'highlight' : '';
          return `<span class="${cls}">${q}</span>`;
        })
        .join(' ');
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
  pointer-events: none;
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
  display: flex;                /* 🔥 ADD */
  flex-direction: column;      /* 🔥 ADD */
  align-items: center;         /* 🔥 ADD */
  justify-content: center;     /* 🔥 ADD to vertically center */
}

.continue-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  z-index: 4;
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
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  color: white;
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
</style>
