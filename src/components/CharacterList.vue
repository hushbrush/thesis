<template>
    <div class="character-list">
      <div
        v-for="(group, index) in groupedClusters"
        :key="index"
        class="cluster-group"
      >
        <h2 :style="{ color: group.color }">{{ group.title }}</h2>
        <ul>
          <li
            v-for="char in group.characters"
            :key="char.character"
            :style="{ color: group.color }"
          >
            {{ char.character }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CharacterList',
    data() {
      return {
        forceData: [],
        clusterMeta: [
          { title: "The Devoted", color: "#DBF39D" },
          { title: "The Wild Ones", color: "#FF6B6B" },
          { title: "The Queens", color: "#FBA1B7" },
          { title: "The Lovers", color: "#6CD4FF" },
          { title: "The Hearthkeepers", color: "#F9C74F" },
          { title: "The Outcasts", color: "#9D4EDD" },
          { title: "The Furies", color: "#EF476F" },
          { title: "The Protectors", color: "#FFD166" }
        ]
      }
    },
    computed: {
      groupedClusters() {
        const groups = this.clusterMeta.map((meta, i) => ({
          ...meta,
          characters: this.forceData.filter(d => d.archetype === i)
        }))
        return groups
      }
    },
    mounted() {
      fetch('/assets/data.json')
        .then(res => res.json())
        .then(data => {
          this.forceData = data
        })
    }
  }
  </script>
  
  <style scoped>
  .character-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 60px;
    background-color: #000;
    color: white;
    font-family: 'Merriweather', serif;
  }
  
  .cluster-group {
    flex: 1 1 300px;
    margin: 40px 20px;
  }
  
  h2 {
    font-size: 22px;
    margin-bottom: 12px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    font-size: 16px;
    margin: 4px 0;
  }
  </style>
  