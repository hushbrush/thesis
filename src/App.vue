<template>
  <div class="app">
    <!-- Landing screen -->
    <landing-page
      v-if="currentStep === 'landing'"
      @start-quiz="startQuiz"
      @open-modal="showModal = true"
    />

    <!-- Quiz -->
    <quiz-flow
      v-else-if="currentStep === 'quiz'"
      :questions="questions"
      @finished="showResult"
    />

    <!-- Silhouette + quotes -->
    <result-reveal
      v-else-if="currentStep === 'result'"
      @continue="showCluster"
    />
    <scroll-stage
      v-else-if="currentStep === 'chart'"
      @show-card="showCharacterCard"
    />

    <!-- D3 Force Cluster -->
    <cluster-force
      v-else-if="currentStep === 'cluster'"
      :nodes="nodes"
      @next="showCharacterList"
    />



    <!-- Character list -->

<character-list
  v-else-if="currentStep === 'list'"
/>

<archetype-card v-else-if="currentStep === 'archetypeMicro'" />


<character-card v-else-if="currentStep === 'card'" />

    <!-- Modal -->
    <modal v-if="showModal" @close="showModal = false" />
  </div>
      <!-- Put this once globally -->
<!-- KEEP this inside App.vue only -->
<div id="tooltip" class="global-tooltip"></div>

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
    ArchetypeCard
  },
  data() {
    return {
      showModal: false,
      currentStep: 'landing', // 
      questions: Questions,
      nodes: data

    }
  },
  methods: {
    startQuiz() {
      this.currentStep = 'quiz'
    },
    showResult() {
      this.currentStep = 'result'
    },
    showCluster() {
      this.currentStep = 'chart'
    },
    showCharacterList() {
    this.currentStep = 'list'
    },
    
    showArchetypeMicro() {
      this.currentStep = 'archetypeMicro'
    }, 
    showCharacterCard() {
      this.currentStep = 'card'
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

body {
  
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
  pointer-events: none;
  font-family: 'inter', serif;
  z-index: 9999;
}

.global-tooltip.visible {
  display: block;
  opacity: 1;
}



</style>
