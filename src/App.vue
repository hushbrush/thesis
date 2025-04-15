<template>
  <div class="app">
    <h1>HI HARSHITA</h1>
    <landing-page @open-modal="showModal = true" />
    <modal v-if="showModal" @close="showModal = false" />
  </div>
</template>


<script>
import modal from './components/modal.vue'
import landingPage from './components/landingPage.vue'


export default {
  components: {
    modal,
    landingPage
  },
  data() {
    return {
      showModal: false
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #000000;
  color: white;
}

.app {
  height: 100vh;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.data-button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #ffffff;
  color: #000000;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.data-button:hover {
  background-color: #cccccc;
}
</style>
