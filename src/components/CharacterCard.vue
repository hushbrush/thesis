<template>
  <div class="character-card">


    <div class="dropdown-container" @click="toggleDropdown">
      <div class="dropdown-label-wrapper">
        <span class="dropdown-label" :style="{ color: dropdownColor }">
          {{ selectedName || 'Select a Character' }}
        </span>
        <span class="dropdown-arrow" :style="{ color: dropdownColor }">▽</span>
      </div>
      <div v-if="showDropdown" class="dropdown-options" @click.stop>
        <div
          class="dropdown-option"
          v-for="(char, idx) in characters"
          :key="char.character"
          @click="selectCharacter(char.character)"
        >
          {{ char.character }}
        </div>
      </div>
    </div>

    <!-- card-content is one flex container with two columns -->
    <div v-if="selectedCharacter" class="card-content">

      <!-- LEFT column: basics + role + hover hint -->
      <div class="left-column">
        <div class="basics">
          <!-- <p class="quote">{{ randomQuote }}</p> -->
          <p class="bio">{{ selectedCharacter.bio }}</p>
          <p class="book-info">
            <em>{{ selectedCharacter.title }}</em><br>
            Translated by {{ selectedCharacter.translator }}<br>
            Read more
            <a :href="`https://en.wikipedia.org/wiki/${selectedCharacter.character}`" target="_blank">here</a>
            or read the book
            <a :href="selectedCharacter.download_link" target="_blank">here</a>
          </p>
          <div class="bar-title">
            What she said vs what others said about her:
          </div>
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
        </div> <!-- /.basics -->

        <div class="role-section">
          <div class="role-title"  :style="{ color: dropdownColor}">
            {{ selectedCharacter.character }}'s Role:
          </div>

          <text-bar
               :key="selectedName"                    
               class="role-bar-chart"
               :item="selectedCharacter"
               :height="40"
               side="left"
               @hover-quote="onBarHover"
               @click="toggleHoverSticky" 
               :show-icon="false"
               :style="{ 'padding-left': '8px' }"
              />

          <p class="hover-hint">
            {{ hoverText ||
               `Hover on the bars to see the text in context of ${selectedCharacter.character}` }}
          </p>
        </div>
      </div> <!-- /.left-column -->

      <!-- RIGHT column: silhouette + meta -->
      <div class="right-column">
        <div class="card-head">
          <div class="silhouette">
            <img
              :src="silhouetteSelector(selectedCharacter.archetype)"
              alt="Character silhouette"
            />
          </div>
          <div
            class="archetype-label"
            :style="{ color: archetypeColor(selectedCharacter.archetype) }"
          >
            {{ archetypeName(selectedCharacter.archetype) }}
          </div>
          <p class="timeline-date">~ {{ selectedCharacter.original_date }}</p>
        </div>
      </div> <!-- /.right-column -->

    </div> <!-- /.card-content -->

  </div> <!-- /.character-card -->
</template>


<script>
import data from '@/assets/data.json'
import TextBar from './textBar.vue'

export default {
  name: 'CharacterCard',
  components: {
    TextBar,      // ← add this
  },
  
  data() {
    return {
      selectedName: '',
      characters: data,
      hoverText:    '' ,
      showDropdown: false,
      isHoverSticky: false, 
    }
  },
  computed: {
    dropdownColor() {
    // if nothing’s selected, default to white
    if (!this.selectedCharacter) return '#ffffff';
    // otherwise grab the archetype’s color
    return this.archetypeColor(this.selectedCharacter.archetype);
  },
  randomQuote() {
    const q = this.selectedCharacter?.quotes_n_loc
    console.log(q[0][0])
    // q.length ? q[Math.floor(Math.random() * q.length)] : 
    return  q[0][0];

  },
  dropdownStyle() {
      if (!this.selectedCharacter) return {}
      // pull the hex from your clusterMeta helper
      const color = this.archetypeColor(this.selectedCharacter.archetype)
      return {
        backgroundColor: '#000' ,    // fill
        borderColor:     color,    // stroke
        color:            color  // text (or pick black if your archetype color is light)
      }
    },

    clusterMeta() {
      return this.$clusterMeta
    },
    selectedCharacter() {
      return this.characters.find(c => c.character === this.selectedName)
    }
  },
  mounted() {
  console.log('[CharacterCard] mounted; selectedName=', this.selectedName);
},
  methods: {
    toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  },
  selectCharacter(name) {
    this.selectedName = name;
    this.showDropdown = false;
  },
   onBarHover(text) {
 // only update on hover when not “stuck”
    if (!this.isHoverSticky) {
      this.hoverText = text;
    }
 },
 toggleHoverSticky() {
 // if there’s currently hoverText but it’s not sticky, stick it
 if (this.hoverText && !this.isHoverSticky) {
   this.isHoverSticky = true;
 } else {
   // otherwise un‐stick and clear
   this.isHoverSticky = false;
   this.hoverText = '';
 }
},
    selectCharacter(name) {
      this.selectedName = name
      this.showDropdown = false
    },
    archetypeName(index) {
      return this.clusterMeta[index]?.name || 'Unknown'
    },
    barChart() {
      // Placeholder for bar chart logic
    },
    archetypeColor(index) {
      return this.clusterMeta[index]?.color
    },
    silhouetteSelector(index) {
      try {
        console.log('index', index);
        return new URL(`../assets/silhouettes/${index}.svg`, import.meta.url).href;
      } catch (err) {
        console.error('Silhouette fallback triggered:', err);
        return new URL('../assets/silhouettes/default.svg', import.meta.url).href;
      }
    }

    // the tooltip wont work anymore, need to fix that.
  }
}
</script>


<style scoped>
.character-card {
  min-height: 100vh;
  width: auto;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  background: #000000;
  color: #ffffff;
  font-family: 'Jaro';
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
  font-family: Oswald, Sans-serif;
  flex: 2;
  text-align: left;
}

.right-column {
  flex: 1;
  border: 0.5px solid #ffffff;
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
  border: 0.5px solid #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 12px;
  letter-spacing: 2px;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  text-align: left;
  cursor: pointer;
  fill: #000
}
.name {
  
 
  border: 0.5px solid #ffffff;
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 12px;
}

.quote {
  padding-top: 40px;
  color: #ffffff;
font-family: Oswald, Sans-serif;
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: normal;
}

.bio {
  color: #ffffff;
font-family: Oswald, Sans-serif;
font-size: 20px;
font-style: normal;
font-weight: 200;
line-height: normal;
letter-spacing: 0.055em;
}
.href {
  color: #ffffff;}
.book-info {
  color: #ffffff;
font-family: Oswald, Sans-serif;
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
  color: #ffffff;
font-family: Oswald, Sans-serif;
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

  background-color: #ffffff;
  transition: width 0.5s ease;
}

.bar-others {
  background-color: #7b7b7b;
  transition: width 0.5s ease;
}
.role-section{
  padding-top: 20px;
}
.role-title {
  display: flex;
  gap: 4px;
 margin-bottom: 1.5rem;
  color: #ffffff;
font-family: Jaro, Sans-serif;
font-size: 30px;
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
  opacity: 0.8;
  border: 0.5px solid #ffffff;
  padding: 0.5rem;
  border-radius: 12px;
  font-size: 24px;
  color:  #ffffff;
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
  color:  #ffffff;
}

.bar-fill {
  background: #ffffff;
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
  color: #ffffff;
  margin-top: 1rem;
  font-size: 3rem;
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

.role-bar-chart svg {
  
  max-height: 40px;

}

.role-bar-chart .icon-container {
  display: none;


}


/* drop down */


/* Dropdown styles */
.dropdown-container {
  text-transform: uppercase;
  width: 100%;
  max-width: 500px;
  font-family: jaro;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(251, 251, 251, 0.5);
  font-size: 36px;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.dropdown-label-wrapper {
  display: flex;
  align-items: center;
  width: 90%;
  justify-content: space-between;
}
.dropdown-options {
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  background: #444;
  color: white;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
  z-index: 10;
}
.dropdown-option {
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.dropdown-option:hover {
  background-color: #222;
}
.dropdown-arrow {
  margin-left: 0.5rem;
  align-items: center;
  display: flex;
}


</style>
