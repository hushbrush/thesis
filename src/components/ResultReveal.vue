<template>


  <div class="reveal-layout">
    
    <button class="back-button" @click="$emit('restart-quiz')">
  ← Back to Quiz
</button>
    <!-- General text background -->
    <div class="text-wall general">
      <p
        v-for="(quote, i) in quotes"
        :key="'general-' + i"
        class="quote"
      >
        {{ quote }}
      </p>
    </div>

    <!-- Masked red text -->
    <div class="text-wall inside" style="clip-path: url(#silhouette-mask);">
      <p
        v-for="(quote, i) in quotes"
        :key="'inside-' + i"
        class="quote inside-only"
      >
        {{ quote }}
      </p>
    </div>

    <!-- Optional: red SVG outline glow -->
    <img
  class="archetype-outline"
  :src="`src/assets/silhouettes/${archetypeIndex}.svg`"
  :style="{ 'opacity': 1, 'mix-blend-mode': 'screen', 'fill': 'red' }"
  alt="Silhouette Outline"
/>



  </div>
  <button class="continue-button" @click="$emit('continue')">
  Continue to Archetypes →
</button>

</template>

<script>
import quotes from '@/assets/quotes.json'

export default {
  name: 'ResultReveal',
  
  emits: ['continue', 'restart-quiz'],

  props: {
  archetypeIndex: {
        type: Number,
        default: 0
      }
    },


  data() {
    return {
      quotes,
    }
  }
}
</script>

<style scoped>
.reveal-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: black;
  overflow: hidden;
}

.text-wall {
  position: relative;
  inset: 0;
  padding: 40px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  font-family: 'Merriweather', serif;
  font-size: 18px;
  line-height: 1.4;
  z-index: 1;
  pointer-events: none;
}

.quote {
  flex: 1 0 30%;
  margin: 5px;
}

.general {
  color: #525252;
}

.inside {
  color: red;
  z-index: 2;
}

.inside-only {
  color: red;
}

.archetype-outline {
  position: absolute;
  inset: 0;
  margin: auto;
  height: 80%;
  width: auto;
  z-index: 3;
  pointer-events: none;
  /* mix-blend-mode: screen; */
  /* filter: drop-shadow(0 0 5px red); */
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
</style>
