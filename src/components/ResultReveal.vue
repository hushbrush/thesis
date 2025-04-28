<template>
  <div class="reveal-layout">
    <!-- SVG mask definition -->
    <svg viewBox="0 0 800 800" class="mask-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="silhouette-mask">
          <!-- Replace this path with your actual huntress outline from huntress.svg -->
          <path d="huntress.svg" fill="white"/>
        </clipPath>
      </defs>
    </svg>

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
    <img class="huntress-outline" src="@/components/huntress.svg" alt="Huntress Outline" />
  </div>
  <button class="continue-button" @click="$emit('continue')">
  Continue to Archetypes →
</button>

</template>

<script>
import quotes from '@/assets/quotes.json'

export default {
  name: 'ResultReveal',
  
  emits: ['continue'],


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
  position: absolute;
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

.huntress-outline {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 40%;
  height: auto;
  z-index: 3;
  pointer-events: none;
  /* mix-blend-mode: screen; */
  /* filter: drop-shadow(0 0 5px red); */
}
</style>
