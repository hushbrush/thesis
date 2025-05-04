<template>
    <div class="compare-container">
      <div class="col">
        <h3>Epic A</h3>
        <EpicComparer 
          :items="items" 
          @hover-quote="setCenterQuote"
        />
      </div>
  
      <div class="center-box">
        <p v-if="centerQuote">{{ centerQuote }}</p>
        <p v-else class="placeholder">
          Hover over a colored segment to see the quote.
        </p>
      </div>
  
      <div class="col">
        <h3>Epic B</h3>
        <EpicComparer 
          :items="items" 
          @hover-quote="setCenterQuote"
        />
      </div>
    </div>
  </template>
  
  <script>
  import EpicComparer from './EpicComparer.vue';
  
  export default {
    name: 'CompareEpics',
    components: { EpicComparer },
    props: {
      items: { type: Array, required: true }
    },
    data() {
      return {
        centerQuote: ''
      };
    },
    mounted() {
  console.log('[CompareEpics] mounted; currentStep should be "compare"');
},
    methods: {
      setCenterQuote(q) {
        this.centerQuote = q;
      }
    }
  };
  </script>
  
  <style scoped>
  .compare-container {
    display: grid;
    grid-template-columns: 1fr 300px 1fr;
    gap: 1rem;
    align-items: start;
  }
  .center-box {
    position: sticky;
    top: 1rem;
    background: #111;
    border: 2px solid #444;
    border-radius: 8px;
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
    color: #fff;
  }
  .placeholder {
    opacity: 0.6;
    font-style: italic;
  }
  .col {
    overflow-y: auto;
    max-height: 90vh;
  }
  </style>
  