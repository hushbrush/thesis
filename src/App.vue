<template>
  <div class="app">
    <header class="header">
      <h1 class="title">My Project Title</h1>
      <button class="data-button" @click="showModal = true">Data</button>
    </header>

    <Modal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import modal from './components/modal.vue'

export default {
  components: {
    modal
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

.title {
  font-size: 2.5em;
  margin: 0;
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
