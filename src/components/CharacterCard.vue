<template>
    <div class="character-card">
      <h2>Select a Character</h2>
      <select v-model="selectedName">
        <option disabled value="">-- Select --</option>
        <option v-for="char in characters" :key="char.character" :value="char.character">
          {{ char.character }}
        </option>
      </select>
  
      <div v-if="selectedCharacter" class="card-details">
        <h3>{{ selectedCharacter.character }}</h3>
        <p><strong>Archetype:</strong> {{ archetypeName(selectedCharacter.archetype) }}</p>
        <p><strong>Original Date:</strong> {{ selectedCharacter.original_date }}</p>
        <p><strong>Latitude:</strong> {{ selectedCharacter.lat }}</p>
        <p><strong>Longitude:</strong> {{ selectedCharacter.lon }}</p>
        <!-- Add anything else from your data -->
      </div>
    </div>
  </template>
  
  <script>
  import data from '@/assets/data.json'
  export default {
    name: 'CharacterCard',
    data() {
      return {
        selectedName: '',
        characters: data,
        clusterMeta: [ // same clusterMeta for color/archetype lookup
          { name: "Devoted" }, { name: "Wild Ones" }, { name: "Queens" },
          { name: "Lovers" }, { name: "Hearthkeepers" }, { name: "Outcasts" },
          { name: "Furies" }, { name: "Protectors" }
        ]
      }
    },
    computed: {
      selectedCharacter() {
        return this.characters.find(c => c.character === this.selectedName)
      }
    },
    methods: {
      archetypeName(index) {
        return this.clusterMeta[index]?.name || 'Unknown'
      }
    }
  }
  </script>
  
  <style scoped>
  .character-card {
    color: white;
    background: black;
    padding: 4rem;
  }
  .card-details {
    margin-top: 2rem;
    padding: 2rem;
    border: 1px solid white;
    border-radius: 8px;
    background: #111;
  }
  select {
    padding: 0.5rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
  </style>
  