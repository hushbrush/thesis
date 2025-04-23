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

<character-card v-else-if="currentStep === 'card'" />

    <!-- Modal -->
    <modal v-if="showModal" @close="showModal = false" />
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
    CharacterCard
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
      this.currentStep = 'chart' // 👈 this should match the view from above
    },
    showCharacterList() {
    this.currentStep = 'list'
    },
   // In App.vue or your state logic
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
  height: 100vh;
  width: 100vw;
  
}

body {
  
  font-family: Arial, sans-serif;
  background-color: #000;
  color: white;
}

/* .app {
  width: 100%;
  height: auto;
  overflow: hidden;
} */
</style>
