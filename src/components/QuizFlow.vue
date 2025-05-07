<!-- QuizFlow.vue -->
<template>
  <section class="quiz-container">
    <template v-if="currentQuestionIndex < questions.length">
      <QuestionCard
        :question="questions[currentQuestionIndex]"
        :questionIndex="currentQuestionIndex"
        :total="questions.length"
        @answered="handleAnswer"
      />
    </template>
    <!-- when done, emits 'finished' with the archetype index -->
  </section>
</template>

<script>
import QuestionCard from './QuestionCard.vue'

export default {
  name: 'QuizFlow',
  components: { QuestionCard },
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
          const archetypeIndex = this.calculateArchetype(this.answers)
          this.$emit('finished', archetypeIndex)
        }
      }, 0)
    },
    calculateArchetype(answers) {
      const counts = Array(7).fill(0)

      answers.forEach(answer => {
        switch (answer) {
          // 0: Otherworldly
          case 'Embrace mystery':
          case 'Seek hidden truths':
          case 'Mystical aura':
          case 'The Oracle':
          case 'Mythic legacy':
          case 'Eleven (Stranger Things)':
            counts[0]++
            break

          // 1: Oathbearer
          case 'Keep your word':
          case 'Honor your vows':
          case 'Vow-keeper':
          case 'The Oathkeeper':
          case 'Sacred promise':
          case 'Brienne of Tarth (Game of Thrones)':
            counts[1]++
            break

          // 2: Unyielding
          case 'Stand unbroken':
          case 'Face the storm':
          case 'Unyielding spirit':
          case 'The Resolute':
          case 'Stalwart resolve':
          case 'Imperator Furiosa (Mad Max: Fury Road)':
            counts[2]++
            break

          // 3: Powerful Consort
          case 'Shape destinies':
          case 'Inspire and guide':
          case 'Empowering others':
          case 'The Consort':
          case 'Influential counsel':
          case 'Claire Underwood (House of Cards)':
            counts[3]++
            break

          // 4: Loyal Strategist
          case 'Plan carefully':
          case 'Strategize victory':
          case 'Strategic mind':
          case 'The Strategist':
          case 'Political acumen':
          case 'Hermione Granger (Harry Potter)':
            counts[4]++
            break

          // 5: Duty-Bound Kin
          case 'Protect kin':
          case 'Guard your own':
          case 'Family pillar':
          case 'The Matriarch':
          case 'Dynastic growth':
          case 'Catelyn Stark (Game of Thrones)':
            counts[5]++
            break

          // 6: Fateful
          case 'Ignite passion':
          case 'Feel the fire':
          case 'Passionate heart':
          case 'The Catalyst':
          case 'Fateful impact':
          case 'Katniss Everdeen (The Hunger Games)':
            counts[6]++
            break
        }
      })

      // return the index of the archetype with the highest tally
      return counts.indexOf(Math.max(...counts))
    },
  },
}
</script>

<style scoped>
.quiz-container {
  background-color: transparent;
}
</style>
