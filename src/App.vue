<template>
  <div class="app">
   

    <!-- Landing screen always shown -->
    <landing-page
      v-if="currentStep === 'landing' || currentStep === 'quiz'"
      :showQuiz="currentStep === 'quiz'"
      @start-quiz="startQuiz"
      @open-modal="showModal = true"
    />

    <!-- Quiz flow floats on top -->
    <quiz-flow
      v-if="currentStep === 'quiz'"
      :questions="questions"
      @finished="showResult"
    />

    <result-reveal
      v-else-if="currentStep === 'result'"
      :archetypeIndex="archetypeIndex"
      @continue="showCluster"
      @restart-quiz="restartQuiz"
    />

  <!-- Step 4: Scroll stage with 3 views -->
    <scroll-stage
      v-if="currentStep === 'chart'"
      @reached-end="showArchetypeMicro"
    />

<!-- Step 5: Archetype microcards after scroll ends -->
<archetype-card
  v-else-if="currentStep === 'archetypeMicro'"
  @scroll-to-character="showCharacterCard"
/>

<!-- Step 6: Character card appears after selection -->
<character-card v-else-if="currentStep === 'card'" />

    
    <character-list v-else-if="currentStep === 'list'" />
    <modal v-if="showModal" @close="showModal = false" />

    <div id="tooltip" class="global-tooltip"></div>
  </div>
</template>



<script>
import Modal from './components/modal.vue'
import LandingPage from './components/landingPage.vue'
import QuizFlow from './components/QuizFlow.vue'
import ResultReveal from './components/ResultReveal.vue'
import ClusterForce from './components/ClusterForce.vue'
import CharacterList from './components/CharacterList.vue'
import ScrollStage from './components/ScrollStage.vue'
import ArchetypeCard from './components/ArchetypeMicro.vue'
import Questions from "@/assets/questions.json"
import CharacterCard from './components/CharacterCard.vue'
import data from '@/assets/data.json' // ✅ Use this exact path
import QuestionCard from './components/QuestionCard.vue'





export default {
  components: {
    Modal,
    LandingPage,
    QuizFlow,
    ResultReveal,
    ClusterForce,
    CharacterList,
    ScrollStage,
    CharacterCard,
    ArchetypeCard,
    QuestionCard
  },
  data() {
    return {
      showModal: false,
      currentStep: 'landing', // 
      questions: Questions,
      nodes: data,
      highlightedSection: null,
      archetypeIndex: null


    }
  },
  methods: {
  scrollToCharacter() {
    const section = this.$refs.characterSection;
    if (section && section.$el) {
      section.$el.scrollIntoView({ behavior: 'smooth' });
    }
  },

  startQuiz() {
    this.currentStep = 'quiz';
  },

  showResult(archetypeIndex) {
    this.currentStep = 'result';
    this.archetypeIndex = archetypeIndex;
  },

  // ✅ Step 4 — Enter scroll stage
  showCluster() {
    this.currentStep = 'chart';
  },

  // ✅ Step 5 — After scroll ends
  showArchetypeMicro() {
    this.currentStep = 'archetypeMicro';
  },

  // ✅ Step 6 — After user selects a character
  showCharacterCard() {
    this.currentStep = 'card';
  },

  showCharacterList() {
    this.currentStep = 'list';
  },

  handleQuizAnswer(option) {
    this.highlightedSection = `q${this.questions.indexOf(option)}`;
  },

  restartQuiz() {
    this.currentStep = 'quiz';
  }
}

}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #000 !important;
  max-width: 100vw;
  /* overflow-x: hidden; */
}
#app {
  margin: 0 !important; /* Force-reset any injected margin */
  padding: 0 !important;
  width: 100% !important;
  box-sizing: border-box;
}


body {
  padding: 0;
  font-family: Arial, sans-serif;
  color: white;
}
.global-tooltip {
  max-width: 300px;
  position: absolute;
  display: block;
  background: #000000dd;
  padding: 6px 10px;
  font-size: 16px;
  border-radius: 6px;
  pointer-events: all;
  z-index: 9999;
}

.global-tooltip.visible {
  display: block;
  opacity: 1;
}


.sections-wrapper {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.section {
  width: 100%;
}

.snap {
  scroll-snap-align: start;
  min-height: 100vh;
  height: 100vh;
}

.no-snap {
  min-height: 100vh;
  height: auto; 
  scroll-snap-align: none;
}
* {
  box-sizing: border-box;
}

.app {
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
}

</style>
