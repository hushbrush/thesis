<template>
  <div class="app">
    <SilhouetteSVG :highlightedSection="highlightedSection" />

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

    <!-- Smooth scroll section: Archetype + Character Card -->
    <div v-else-if="currentStep === 'chart'" class="sections-wrapper">
      <scroll-stage class="no-snap" />
      <archetype-card
        class="no-snap"
        @scroll-to-character="scrollToCharacter"
      />
      <character-card class="section snap" ref="characterSection" />
    </div>

    <cluster-force
      v-else-if="currentStep === 'cluster'"
      :nodes="nodes"
      @next="showCharacterList"
    />

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
import SilhouetteSVG from './components/SilhouetteSVG.vue'
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
    SilhouetteSVG,
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
    scrollToCharacter() {                       // ← define it here
      const section = this.$refs.characterSection;
      if (section && section.$el) {
        section.$el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    
    startQuiz() {
      this.currentStep = 'quiz'
    },
    showResult(archetypeIndex) {
      this.currentStep = 'result'
     this.archetypeIndex = archetypeIndex  // 🆕 store the final archetype number
    },
    showCluster() {
  this.currentStep = 'cluster'
},

    showCharacterList() {
    this.currentStep = 'list'
    },
    
    showArchetypeMicro() {
      this.currentStep = 'archetypeMicro'
    }, 
    showCharacterCard() {
      this.currentStep = 'card'
    },
    handleQuizAnswer(option) {
      this.highlightedSection = `q${this.questions.indexOf(option)}`
    },
    restartQuiz() {
  this.currentStep = 'quiz'
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
  overflow-x: hidden;
  
}
.app{
  padding: 0;
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
  font-family: 'inter', serif;
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


</style>
