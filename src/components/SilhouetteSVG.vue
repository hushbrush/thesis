<template>
    <div class="silhouette-wrapper">
      <svg class="silhouette" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <!-- Example paths with unique IDs for animation targets -->
        <path id="q0" class="silhouette-line" d="M 0 10 H 200" />
        <path id="q1" class="silhouette-line" d="M 0 40 H 200" />
        <path id="q2" class="silhouette-line" d="M 0 70 H 200" />

        <!-- Add paths for q3, q4, q5 as needed -->
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SilhouetteSVG',
    props: ['highlightedSection'],
    watch: {
      highlightedSection(id) {
        if (!id) return
        const path = this.$el.querySelector(`#${id}`)
        if (path) {
          path.classList.add('highlight')
          setTimeout(() => path.classList.remove('highlight'), 1200)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .silhouette-wrapper {
    position: absolute;
    top: 50px;
    right: 0;
    width: 50%;
    height: auto;
  }
  
  .silhouette {
    width: 100%;
    height: auto;
  }
  
  .silhouette-line {
    fill: none;
    stroke: #DBF39D;
    stroke-width: 3;
    transition: stroke 0.4s, stroke-width 0.4s;
  }
  
  .silhouette-line.highlight {
    stroke: #FDB749;
    stroke-width: 6;
  }
  </style>
  