<template>
    <section class="quiz-container">
      <template v-if="currentQuestionIndex < questions.length">
        <QuestionCard
          :question="questions[currentQuestionIndex]"
          :questionIndex="currentQuestionIndex"
          :total="questions.length"
          @answered="handleAnswer"
        />
        <SilhouetteSVG :highlightedSection="highlightedSection" />
      </template>
  
      <ResultReveal v-else />
    </section>
  </template>
  
  <script>
  import QuestionCard from './QuestionCard.vue'
  import SilhouetteSVG from './SilhouetteSVG.vue'
  import ResultReveal from './ResultReveal.vue'
  
  export default {
    name: 'QuizFlow',
    components: {
      QuestionCard,
      SilhouetteSVG,
      ResultReveal
    },
    props: ['questions'],
    data() {
      return {
        currentQuestionIndex: 0,
        answers: [],
        highlightedSection: null,
      }
    },
    methods: {
      handleAnswer(option) {
  this.answers.push(option)
  this.highlightedSection = `q${this.currentQuestionIndex}`

  setTimeout(() => {
    this.highlightedSection = null
    this.currentQuestionIndex++

    if (this.currentQuestionIndex >= this.questions.length) {
      this.$emit('finished') // ✅ DONE WITH QUIZ
    }
  }, 1500)
}

    }
  }
  </script>
  
  <style scoped>
  .quiz-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  </style>
  