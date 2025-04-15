<template>
    <section class="landing">
      <div class="text-block">
        <h1 class="main-title">Cookie Cutter Women</h1>
        <p class="subtitle">An exploration of patterns, voices, and the way we tell stories.</p>
        <button class="data-button" @click="$emit('open-modal')">Data</button>
      </div>
<!--       <img src="./assets/vue.svg" class="corner-svg" alt="Decorative SVG" />
 -->    ̰ </section>
</template>
  
<script>
export default {
  name: "landingPage",
  emits: ['open-modal']
}
</script> 

  
<style scoped>
  .landing {
    background-color: #000000;
    color: #FFD700; /* Gold-ish yellow */
    min-height: 100vh;
    width: 100%;
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .text-block {
    max-width: 800px;
    z-index: 1;
  }
  
  .main-title {
  color: #FDCD54;
  font-family: 'Jaro', sans-serif;
  font-size: 96px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  padding: 0 0 0 0;
  
}

  
  .subtitle {
    color: #FDCD54;
    font-family: Jura;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  
  .corner-svg {
    position: absolute;
    bottom: 30px;
    right: 30px;
    width: 120px;
    opacity: 0.9;
    pointer-events: none;
  }
  </style>
  