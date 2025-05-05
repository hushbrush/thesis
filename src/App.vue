<template>
  <div class="app">
    <div class="sections-wrapper">

         <!-- SECTION 1: Landing / Quiz -->
   <section v-if="currentStep === 'landing' || currentStep === 'quiz'" class="section snap">
     <landing-page
       :showQuiz="currentStep === 'quiz'"
       @start-quiz="startQuiz"
       @open-modal="showModal = true"
     />
     <quiz-flow
       v-if="currentStep === 'quiz'"
       :questions="questions"
       @finished="showResult"
     />
   </section>

   <!-- SECTION 2: Result reveal -->
   <section v-if="currentStep === 'result'" class="section snap">
     <result-reveal
       :archetypeIndex="archetypeIndex"
       @continue="showCluster"
       @restart-quiz="restartQuiz"
     />
   </section>
      <!-- SECTION 3: ScrollStage (you were missing this) -->
   <section
     v-if="currentStep === 'chart'"
     ref="chartSection"
     class="section no-snap"
   >
     <scroll-stage @reached-end="showArchetypeMicro" />
   </section>

      <!-- SECTION 4: ArchetypeMicro -->
      <section
  v-if="currentStep === 'archetypeMicro'"
  ref="microSection"
  class="section snap archetype-micro-scroll"
>

        <archetype-card
          :nodes="nodes"
          :initialSelected="archetypeIndex"
          @scroll-to-character="showCompare"
        />
  </section>

      <!-- SECTION 5: CompareEpics -->
      <section
  v-if="currentStep === 'compare'"
  ref="compareSection"
  class="section snap"
>
        <CompareEpics
          :items="nodes"
          @scroll-to-character="showCharacterCard"
        />
      </section>

      <!-- SECTION 6: CharacterCard / List -->
      <section v-if="currentStep === 'card' || currentStep === 'list'" class="section snap">
        <character-card v-if="currentStep === 'card'" />
        <character-list v-else />
      </section>

      <!-- SECTION 7: Outro (no-snap) -->
      <section v-if="currentStep === 'outro'" class="section no-snap">
        <h4>…outro text…</h4>
        <button @click="showModal = true">About the data</button>
        <modal v-if="showModal" @close="showModal = false" />
      </section>

    </div>

    <div id="tooltip" class="global-tooltip"></div>
  </div>
</template>



<script>
import Modal from './components/modal.vue'
import LandingPage from './components/landingPage.vue'
import QuizFlow from './components/QuizFlow.vue'
import ResultReveal from './components/ResultReveal.vue'
import CharacterList from './components/CharacterList.vue'
import ScrollStage from './components/ScrollStage.vue'
import ArchetypeCard from './components/ArchetypeMicro.vue'
import CharacterCard from './components/CharacterCard.vue'
import CompareEpics from './components/CompareEpics.vue'
import Questions from "@/assets/questions.json"
import data from '@/assets/data.json'

export default {
  components: {
    Modal,
    LandingPage,
    QuizFlow,
    ResultReveal,
    CharacterList,
    ScrollStage,
    CharacterCard,
    ArchetypeCard,
    CompareEpics
  },
  data() {
    return {
      showModal: false,
      currentStep: 'landing',
      questions: Questions,
      nodes: data,
      archetypeIndex: null
    }
  },
  watch: {
    currentStep(newStep) {
      console.log('[App] currentStep →', newStep);
    }},
  methods: {
    startQuiz() {
      this.currentStep = 'quiz';
    },

    showResult(archetypeIndex) {
      this.currentStep = 'result';
      this.archetypeIndex = archetypeIndex;
    },

    // Step 4 — show scroll-stage and snap to it
    showCluster() {
      console.log('[App] showCluster() — about to switch to chart');
      this.currentStep = 'chart';
      this.$nextTick(() => {
        this.$refs.chartSection.scrollIntoView({ behavior: 'smooth' });
      });
    },

    // Step 5 — show archetype-micro and snap to it

    async showArchetypeMicro() {
    console.log('[App] showArchetypeMicro() called — before switching, currentStep=', this.currentStep);
    this.currentStep = 'archetypeMicro';
    await this.$nextTick();
    const el = this.$refs.microSection;
    console.log('[App] showArchetypeMicro() — microSection ref is', el);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('[App] showArchetypeMicro() — microSection ref missing');
    }
  },

   


    
    async showCompare() {
    console.log('[App] showCompare() called — before switching, currentStep=', this.currentStep);
    this.currentStep = 'compare';
    await this.$nextTick();
    const el = this.$refs.compareSection;
    console.log('[App] showCompare() — ref compareSection is', el);
    if (el) {
      console.log('[App] showCompare() — scrolling into view');
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('[App] showCompare() — compareSection ref missing');
    }
  },




    showCharacterCard() {
      this.currentStep = 'card';
    },
    showCharacterList() {
      this.currentStep = 'list';
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
}
section {
  margin: 0;
  padding: 0;
}
body {
  display: block !important;
  place-items: unset !important;
}

/* make sure your app really fills the viewport */
#app, 
.app {
  width: 100vw;
  height: 100vh;
  padding: 0 !important;
  margin: 0 !important;
}


.sections-wrapper {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
.section.snap {
  /* at least one viewport tall, but can grow to fit content */
  min-height: 100vh;
  scroll-snap-align: start;

  

}
/* only the ArchetypeMicro section scrolls internally */
.archetype-micro-scroll {
  height: 100vh;
  overflow-y: auto;
}

.section.no-snap {
  scroll-snap-align: none;
  min-height: 100vh;
  height: auto;
}
</style>
