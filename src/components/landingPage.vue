<template>
    <section class="landing">
      <div class="text-block" v-if="!showQuiz">
        <h1 class="main-title">
          <div class="outlined-title">COOKIE</div>
          <div class="outlined-title">CUTTER</div>
          <div class="filled-title">WOMEN</div>
        </h1>
        <p class="subtitle">An Analysis of Female Archetypes in Epic Literature across Time & Cultures.</p>
        <!-- <button class="data-button" @click="$emit('open-modal')">Data</button> -->
          <button class="quiz-button" @click="$emit('start-quiz')">START EXPLORING</button>
      </div>
      <img class="hero-svg" src="/Users/harshitachakravadhanula./Desktop/sem2/thesis/majorStudio2/thesis/public/sillhouettes.svg" alt="Silhouettes" />
      <img class="main-branch" src="/Users/harshitachakravadhanula./Desktop/sem2/thesis/majorStudio2/thesis/public/branches.svg" alt="branches illustration" />
      <img class="side-branches" src="/Users/harshitachakravadhanula./Desktop/sem2/thesis/majorStudio2/thesis/public/branches.svg" alt="branches illustration" />

<!--       <img src="./assets/vue.svg" class="corner-svg" alt="Decorative SVG" />
 -->    ̰ </section>
</template>
  
<script>
export default {
  name: "landingPage",
  emits: ['start-quiz', 'open-modal'],
  props: {
    showQuiz: {
      type: Boolean,
      default: false
    }
  }
}
</script>


  
<style scoped>
  .landing {
  background-color: #000000;
  color: #FFD700;
  height: 100%;
  width: 100%;


  position: absolute; /* override layout constraints */
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden; /* prevent overflow */}

  
.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 60px 0 0 0px;
  max-width: 800px;
  margin-left: 120px; /* fine-tuned control instead of padding */
  z-index: 1;
}

  

.filled-title {
  font-family: 'Jaro', sans-serif;
  font-size: 108px;
  line-height: 0.8;
  padding-left: 120px;
  margin: 0;
  background: linear-gradient(90deg, #DBF39D, #FDB749);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.outlined-title {
  font-family: 'Jaro', sans-serif;
  font-size: 108px;
  line-height: 0.8;
  padding-left: 120px;
  margin: 0;
  color: black;
  background: linear-gradient(90deg, #DBF39D, #FDB749); /* gradient here */
  -webkit-background-clip: text;
  -webkit-text-stroke: 10px transparent; /* stroke gets filled by bg */
  background-clip: text;
  letter-spacing: 8px;
}


.hero-svg {
  position: absolute;
  right: 40px;
  top: 300px;
  /* bottom: 0; */
  height: 150%;
  z-index: 0;
  opacity: 0.95;
  
}

  .subtitle {
    padding: 0 0 0 120px;
    color: #FDCD54;
    width: 320px;
    font-size: 28px;
    font-style: normal;
    line-height: 1.2;
    text-align: left;
    font-family: 'Oswald', sans-serif;
    font-weight: 400;
    font-style: normal;
    letter-spacing: 1.1;
  }
  
  .corner-svg {
    position: absolute;
    bottom: 30px;
    right: 30px;
    width: 120px;
    opacity: 0.9;
    pointer-events: none;
  }
  .quiz-button {
 
  position: relative;
  left: 120px;
  top: 140px;
  width: 300px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 20px;

  background-color: #FFF; /* 🔥 this ensures white background stays */
  box-shadow: 0px 4px 4px 1px #ffcf5782;

  /* Gradient text fix */
  background-image: linear-gradient(90deg, #DBF39D, #FDB749); /* just changes name */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  text-align: center;
  font-family: 'Jaro', sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 0;
  border: none;
  cursor: pointer;
/* give the type box shadow, make the button white, add the branches. */



  }
  .side-branches {
  position: absolute;
  left: -15%;          /* Push half of it off the left side */
  bottom: 0;
  width: 35%;          /* Full width so half remains visible */
  height: auto;         /* Adjust height to match visual needs */
  z-index: 10;
  rotate: -120deg;
  pointer-events: none; /* Optional: if it's purely decorative */
}
.main-branch {
  position: absolute;
  top: 0%;          /* Push half of it off the left side */
  bottom: 0;
  width: 20%;          /* Full width so half remains visible */
  height: auto;         /* Adjust height to match visual needs */
  z-index: 10;
  left: 40px;
  
  pointer-events: none; /* Optional: if it's purely decorative */
}
  </style>
  