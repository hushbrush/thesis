<template>
    <div class="question-card">
      <transition name="fade">
        <div v-if="question" class="question-content">
          <h2 class="question-text">{{ question.text }}</h2>
          <div class="options-line">
            <label v-for="(option, index) in question.options" :key="index" class="radio-option">
              <input
                type="radio"
                :value="option"
                v-model="selected"
                @change="submit"
                name="quiz"
              />
              {{ option }}
            </label>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionCard',
    props: ['question', 'questionIndex', 'total'],
    data() {
      return {
        selected: null,
      }
    },
    methods: {
      submit() {
        this.$emit('answered', this.selected)
      }
    }
  }
  </script>
  
  <style scoped>

  .question-card {
  position: absolute;
  top: 20vh;
  left: 20vh;
  width: calc(33.33vw);
  height: calc(60vh );
  background: rgba(0,0,0,0.7); /* optional: background */
  padding: 40px;
  border-radius: 10px;
  z-index: 10; /* must be higher than SVG */
}

  .question-text {
    font-family: 'Merriweather', serif;
    font-size: 28px;
    color: #FDB749;
    margin-bottom: 30px;
  }
  
  .options-line {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
}

  
  .radio-option {
    font-family: 'Jaro', sans-serif;
    font-size: 24px;
    color: #FFF;
    cursor: pointer;
  }
  
  input[type="radio"] {
    margin-right: 10px;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.8s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  