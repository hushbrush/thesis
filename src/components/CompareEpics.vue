<template>
  <div class= "everything_container">
  <h2> Compare Characters across Epics:</h2>
    <div class="compare-container">
      
      <div class="col">
       
        <EpicComparer 
          :items="items" 
          side="left"
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
        
        <EpicComparer 
          :items="items" 
          side="right"
          @hover-quote="setCenterQuote"
        />
      </div>
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
  h2{
    font-size: 60px;
    padding-bottom: 2rem;
  }
  .compare-container {
    background: #000;
    display: grid;
    grid-template-columns: 1fr 300px 1fr;
    gap: 1rem;
    align-items: start;
  }
  .center-box {
    position: sticky;
    top: 2rem;
    background: #fff;
    border: 2px solid #444;
    border-radius: 8px;
    padding: 1rem;
    color: #000;
    height: 50%;
    width: 100%;
    margin-top: 50%;


  }

 
  .placeholder {
    opacity: 0.6;
    font-style: italic;
  }
  .col {
    max-height: none;
    
  }
 .everything_container{
 background: #000;
 margin-top: 2rem;
 padding: 2rem;

 }
  </style>
  