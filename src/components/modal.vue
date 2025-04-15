<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="close-button" @click="$emit('close')">×</button>
        <h2>Data Documentation</h2>
        <p>A paragraph introducing the data collection process</p>
        <p>1. The Number of Epics: these were collected through a combination of methods. The main one was Project Gutenberg. Using the Gutendex API, I was able to get the text </p>
        <div id="numberOfEpics" class="number-container"></div>
        <p>2. Where are these epics from?</p>
        <div class="flourish-embed flourish-map" data-src="visualisation/21924741"></div>
        <p>3. The Characters: from the texts, I put it into chatpdf.ai and extracted characters which had most words said about them and said most words. This decisioon was made mostly to work with the limitation of the characteristics and archetype extraction, which needed a certain textual corpus to work.</p>
        <div id="numberOfChars" class="number-container"></div>
        <p>4. The Words said by the characters/about the characters: Extracted using chatpdf.ai</p>
        <div id="wordsBarChart" class="bar-container"></div> 
        <p>5. Characteristics: manually identifying some based on the text(as features), and then running random forests on the rest.</p>
        <div id="characteristicsBarChart" class="bar-container"></div> 
        <p>6. Archetypes: Identified using unsupervised clustering(svd)</p>
        <div id="ArchetypeBarChart" class="bar-container"></div> 
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    emits: ['close'],
    mounted() {
      if (!document.querySelector('script[src="https://public.flourish.studio/resources/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://public.flourish.studio/resources/embed.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        if (window.Flourish) {
          window.Flourish.load();
        }
      }
    }
  }
  </script>
  
  
  <style>
  .modal-overlay {
    position: fixed;
    overflow-y: auto;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 60px;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    color: rgb(0, 0, 0);
    width: 80%;
    max-width: 900px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .close-button {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    color: rgb(0, 0, 0);
    font-size: 1.5em;
    cursor: pointer;
  }
  
  .map-container {
    height: 400px;
    width: 100%;
    border-radius: 8px;
  }
  </style>
  
  <!-- Make sure to install Mapbox and add its CSS in main.js or App.vue -->
  