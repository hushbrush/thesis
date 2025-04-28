<template>
  <div class="character-card">
    <div class="selector">
      <select v-model="selectedName" class="character-select"> //how can I make this dropdown the colour of the archetype
        <option disabled value="">-- Select a Character --</option>
        <option v-for="char in characters" :key="char.character" :value="char.character">
          {{ char.character }}
        </option>
      </select>
    </div>

    <div v-if="selectedCharacter" class="card-content">
      <div class="left-column">
        <div class ="basics">
        <p class="quote">"The duty must be done, even if there is a little suffering involved"</p>

        <p class="bio">
          {{ selectedCharacter.bio }}
        </p>

        <p class="book-info">
          <em>{{ selectedCharacter.title }}</em><br>
          Translated by {{ selectedCharacter.translator }}
          <br>Read more 
          <a :href="`https://en.wikipedia.org/wiki/${selectedCharacter.character}`" target="_blank">here</a>
          or read the book
          <a :href="selectedCharacter.download_link" target="_blank">here</a>
        </p>

      

        <div class="bar-title">What she said vs what others said about her</div>
        <div class="bar-wrapper">
          <div
            class="bar-self"
            :style="{ width: `${Math.min(selectedCharacter.saidvsabout * 100, 100)}%` }"
          ></div>
          <div
            class="bar-others"
            :style="{ width: `${Math.max(100 - selectedCharacter.saidvsabout * 100, 0)}%` }"
          ></div>
        </div>
      </div>
        <div class="role-section">
        <div class="role-title">{{ selectedCharacter.character }}'s Role:</div>
        <div class="role-bar">
        </div>
          <!-- <div v-for="n in 30" :key="n" class="bar" :style="{ height: `${Math.random() * 40 + 20}px` }"></div> -->
        </div>

        <p class="hover-hint">Hover on the bars to see the text in context of {{ selectedCharacter.character }}</p>
      </div>

      <div class="right-column">
        <div class="card-head">
          <div class="silhouette">
            <img :src="silhouetteSelector(selectedCharacter.archetype)" alt="Character silhouette" />
           

          </div>
          <div
            class="archetype-label"
            :style="{ color: archetypeColor(selectedCharacter.archetype) }"
          >
            {{ archetypeName(selectedCharacter.archetype) }}
          </div>
          
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
        { name: "Devoted", color: "#DBF39D" },
        { name: "Wild Ones", color: "#caf244" },
        { name: "Queens", color: "#b17fe3" },
        { name: "Lovers", color: "#ff94d6" },
        { name: "Hearthkeepers", color: "#F9C74F" },
        { name: "Outcasts", color: "#9D4EDD" },
        { name: "Furies", color: "#f56c0a" },
        { name: "Protectors", color: "#7face3" }
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
    },
    barChart() {
      // Placeholder for bar chart logic
    },
    archetypeColor(index) {
       return this.clusterMeta[index]?.color ;
}
,
    silhouetteSelector(index) {
  try {
    console.log('index', index);
    return new URL(`../assets/silhouettes/${index}.svg`, import.meta.url).href;
  } catch (err) {
    console.error('Silhouette fallback triggered:', err);
    return new URL('../assets/silhouettes/default.svg', import.meta.url).href;
  }
}

//the tooltip wont work anymore, need to fic that.
 
}}

</script>

<style scoped>
.character-card {
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
  color: #000;
  font-family: 'jaro', serif;
  padding: 2rem;
  display: flex;
  flex-direction: column;
 
}

.selector {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* ⬅️ align to left */
  width: fit-content;
  
}

.card-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 4rem;
 
}

.left-column {
  font-family: Merriweather;
  flex: 2;
  text-align: left;
}

.right-column {
  flex: 1;
  border: 0.5px solid #000000;
  margin: 1.5rem;
  border-radius: 20px;
  text-align: center;
 
}

.basics{
  padding: 20px;
}
.character-select {
  width: 60%;
 
  font-family: Jaro;
  font-size: 78px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: 0.5px solid #000000;
  padding: 0.4rem 1rem;
  border-radius: 12px;
  letter-spacing: 2px;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-align: left;
  cursor: pointer;
}
.name {
  
 
  border: 0.5px solid #000000;
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 12px;
}

.quote {
  padding-top: 40px;
  color: #000;
font-family: Merriweather;
font-size: 30px;
font-style: normal;
font-weight: 700;
line-height: normal;
}

.bio {
  color: #000;
font-family: Merriweather;
font-size: 20px;
font-style: normal;
font-weight: 400;
line-height: normal;
}
.href {
  color: #ff0000;}
.book-info {
  color: #000;
font-family: Merriweather;
font-size: 16px;
font-style: italic;
font-weight: 400;
line-height: normal;
}

.links a {
  color: #000000;
  text-decoration: underline;
}

.bar-title {
  margin-top: 2rem;
  color: #8A8A8A;
font-family: Merriweather;
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: normal;
}
.bar-wrapper {
  padding: 0, 10px;
  display: flex;
  height: 20px;
  width: 100%;
  /* max-width: 300px; */
  background: #ffffff;
  overflow: hidden;
}

.bar-self {

  background-color: #000000;
  transition: width 0.5s ease;
}

.bar-others {
  background-color: #f4d6d6;
  transition: width 0.5s ease;
}
.role-section{
  padding-top: 20px;
}
.role-title {
  display: flex;
  gap: 4px;
 margin-bottom: 1.5rem;
  color: #8A8A8A;
font-family: Merriweather;
font-size: 26px;
font-style: normal;
font-weight: 700;
line-height: normal;
}

.bar {
  width: 6px;
  background: #000000;
}

.hover-hint {
  font-size: 0.9rem;
  font-style: italic;
  opacity: 0.8;
  border: 0.5px solid #000000;
  padding: 0.5rem;
  border-radius: 12px;
}

.card-head .silhouette {
  margin: 200px;
  width: 100%;
  height: auto;
  margin:  auto;
  position: relative;
  overflow: hidden;
}
.card-head .silhouette img {
  padding: 30px;
  margin: 0 auto; 
  width: 90%;
  height: 90%;
  height: auto;
  object-fit: contain; /* ensures it stays proportional */
  display: block;
  color:  #000000;
}

.bar-fill {
  background: #000000;
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 0;
}
.masked-silhouette {
  width: 120px;
  height: 160px;
  background: linear-gradient(to top, #000000 50%, transparent 50%);
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.archetype-label {
  font-weight: bold;
  color: #000000;
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
