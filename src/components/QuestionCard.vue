<template>
  <div class="question-card">
    <!--
      mode="out-in" makes Vue wait for the leave animation
      to finish before inserting the new element.
    -->
    <transition name="fade" mode="out-in">
      <!--
        :key ensures that even if the text changes on
        the same wrapper, Vue treats it as a fresh node.
      -->
      <div
        v-if="question"
        :key="questionIndex"
        class="question-content"
      >
        <h2 class="question-text">{{ question.text }}</h2>
        <div class="options-line">
          <label
            v-for="(option, index) in question.options"
            :key="index"
            class="radio-option"
          >
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
  watch: {
    // whenever the questionIndex (or you could watch 'question')
    // changes, clear out the previous selection

  question(newQ, oldQ) {
    console.log("question prop changed!", { oldQ, newQ });
  },
    questionIndex() {
      this.selected = null;
    }
  },
  methods: {
    submit() {
      console.log("…answered! now emitting and waiting for parent to change question");
      this.$emit('answered', this.selected);
      // you could also clear it here if you want an immediate reset
      // this.selected = null;
    }
  }
}
</script>
  <style scoped>

  .question-card {
  position: absolute;
  top: 10vh;
  left: 20vh;
  width: 100%;
  height: calc(60vh );
  background: rgba(0,0,0,0.0); /* optional: background */
  padding: 40px;
  border-radius: 10px;
  z-index: 10; /* must be higher than SVG */
}

  .question-text {
    font-family: 'Jaro', sans-serif;
    font-size: 50px;
    color: White;
    margin-bottom: 30px;
    stroke-width: 0px;
    word-spacing: 2;
    letter-spacing: 1;
    /* letter-spacing: 1.5px; */
  font-variation-settings: 'opsz' 1; /* smaller = thinner details */



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
    accent-color: rgba(219,243,157,1);
  }
  
  
  

  </style>
  