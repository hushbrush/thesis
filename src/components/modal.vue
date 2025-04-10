<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <button class="close-button" @click="$emit('close')">X</button>
        <h2>The Data Explanation of this project</h2>
        <p>This is where your data will go.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    emits: ['close']
  }
  </script>
  
  <style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #1a1a1a;
    padding: 30px;
    border-radius: 10px;
    color: white;
    max-width: 400px;
    width: 90%;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 15px;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2em;
    cursor: pointer;
  }
  </style>
  