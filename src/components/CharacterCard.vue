<template>
  <div class="character-card">
    <div class="selector">
      <select v-model="selectedName" class="character-select">
        <option disabled value="">-- Select a Character --</option>
        <option v-for="char in characters" :key="char.character" :value="char.character">
          {{ char.character }}
        </option>
      </select>
    </div>

    <div v-if="selectedCharacter" class="card-content">
      <div class="left-column">
        <p class="quote">"The duty must be done, even if there is a little suffering involved"</p>

        <p class="bio">
          {{ selectedCharacter.bio }}
        </p>

        <p class="book-info">
          <em>{{ selectedCharacter.title }}</em><br>
          Translated by {{ selectedCharacter.translator }}
        </p>

        <p class="links">
          <a href="#">here</a> or read the book <a href={selectedCharacter.download_link}>here</a>
        </p>

        <div class="bar-title">What she said vs what others said about her</div>
        <div class="bar-wrapper">
          <div class="bar-self"></div>
          <div class="bar-others"></div>
        </div>

        <div class="role-title">{{ selectedCharacter.character }}'s Role:</div>
        <div class="role-bar">
          <!-- Fake role bars -->
          <div v-for="n in 30" :key="n" class="bar" :style="{ height: `${Math.random() * 40 + 20}px` }"></div>
        </div>

        <p class="hover-hint">Hover on the bars to see the text in context of {{ selectedCharacter.character }}</p>
      </div>

      <div class="right-column">
        <div class="card-head">
          <div class="silhouette">
            <div class="half-fill"></div>
          </div>
          <div class="archetype-label">{{ archetypeName(selectedCharacter.archetype) }}</div>
          <p class="timeline-dot">● ● ● <strong>●</strong> ● ●</p>
          <p class="timeline-date">~ {{ selectedCharacter.original_date }}</p>
        </div>
      </div>
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
      clusterMeta: [
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
  height: 100vh;
  width: 100vw;
  background: #fff;
  color: #000;
  font-family: 'Merriweather', serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.selector {
  margin-bottom: 2rem;
  align-items: left;
}

.card-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 4rem;
}

.left-column {
  flex: 2;
  text-align: left;
}

.right-column {
  flex: 1;
  border: 0.5px solid #c30000;
  padding: 1.5rem;
  border-radius: 20px;
  text-align: center;
}


.character-select {
  color: #C40000;
  font-family: Jaro;
  font-size: 96px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: 0.5px solid #c30000;
  padding: 0.4rem 1rem;
  border-radius: 12px;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-align: left;
  cursor: pointer;
}
.name {
  
 
  border: 0.5px solid #c30000;
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 12px;
}

.quote {
  font-size: 1.2rem;
  margin: 1rem 0;
  font-weight: bold;
}

.bio {
  margin: 1rem 0;
}

.book-info {
  font-style: italic;
  margin: 0.5rem 0;
}

.links a {
  color: #c30000;
  text-decoration: underline;
}

.bar-title {
  margin-top: 2rem;
  font-weight: bold;
  color: #444;
}

.bar-wrapper {
  display: flex;
  height: 20px;
  background: #f4d6d6;
  width: 300px;
  margin: 0.5rem 0 2rem;
}

.bar-self {
  width: 60%;
  background: #c30000;
}

.bar-others {
  width: 40%;
}

.role-title {
  display: flex;
  gap: 4px;
  margin-bottom: 1.5rem;
}

.bar {
  width: 6px;
  background: #c30000;
}

.hover-hint {
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.8;
  border: 0.5px solid #c30000;
  padding: 0.5rem;
  border-radius: 12px;
}

.card-head .silhouette {
  width: 120px;
  height: 160px;
  border:0.5px solid #c30000;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.half-fill {
  background: #c30000;
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 0;
}

.archetype-label {
  font-weight: bold;
  color: #c30000;
  margin-top: 1rem;
  font-size: 1.2rem;
}

.timeline-dot {
  font-size: 1rem;
  margin-top: 1rem;
  color: #444;
}

.timeline-date {
  font-size: 0.8rem;
  opacity: 0.6;
}
</style>
