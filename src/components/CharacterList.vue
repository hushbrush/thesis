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
import allData from '@/assets/data.json'

export default {
  name: 'CharacterList',
  data() {
    return {
      // preload the JSON at build time
      forceData: allData
    }
  },
  computed: {
    clusterMeta() {
      return this.$clusterMeta
    },
    groupedClusters() {
      // group each archetype by its characters
      return this.clusterMeta.map((meta, i) => ({
        title: meta.name,
        color: meta.color,
        characters: this.forceData.filter(d => d.archetype === i)
      }))
    }
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
