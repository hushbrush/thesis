<template>
    <div class="archetype-micro-container">
      <div class="dropdown-container">
        <div @click="toggleDropdown">
          <span class="dropdown-label" :style="{ color: selectedColor }">
            {{ selectedArchetypeName }}
          </span>
          <span class="dropdown-arrow" :style="{ color: selectedColor }">▽</span>
        </div>
  
        <div v-if="showDropdown" class="dropdown-options">
          <div
            class="dropdown-option"
            v-for="(name, index) in archetypes"
            :key="index"
            @click="selectArchetype(index)"
          >
            {{ name }}
          </div>
        </div>
      </div>
      <div class="everything">
            <!-- All charts use the same selectedArchetype + clusterMeta -->
            <h2>Important Characteristics</h2>
            <archetype-grid :selectedArchetype="selectedArchetype" :clusterMeta="clusterMeta" />
            <h2 class="h2">
                Explore other characteristics by the 
                <span class="specialText" :style="{ color: selectedColor }">{{ selectedArchetypeName }}</span>
                characteristic
            </h2>
            <h4> X axis = Highest Characteristic</h4>
            <h4> Y axis = Lowest Characteristic  </h4>

            <archetype-scatter :selectedArchetype="selectedArchetype" :clusterMeta="clusterMeta" />
            
            <h2 class="h2">
                Origin of 
                <span class="specialText" :style="{ color: selectedColor }">{{ selectedArchetypeName }}</span>
                : Who came first?
            </h2>
            
          
            <archetype-lineage :selectedArchetype="selectedArchetype" :clusterMeta="clusterMeta" />
            </div>
        </div>
  </template>
  
  <script>
  import ArchetypeGrid from './ArchetypeGrid.vue'
  import ArchetypeScatter from './ArchetypeScatter.vue'
  import ArchetypeLineage from './ArchetypeLineage.vue'
  
  export default {
    components: { ArchetypeGrid, ArchetypeScatter, ArchetypeLineage },
    data() {
      return {
        selectedArchetype: null,
        showDropdown: false,
      }
    },
    computed: {
      // expose globalProperties.$clusterMeta as `this.clusterMeta`
      clusterMeta() {
        return this.$clusterMeta
      },
      archetypes() {
        return this.clusterMeta.map(meta => meta.name)
      },
      selectedArchetypeName() {
        if (this.selectedArchetype === null) return "SELECT ARCHETYPE";
        return this.clusterMeta[this.selectedArchetype]?.name;
      },
      selectedColor() {
        if (this.selectedArchetype === null) return "#ffffff";
        return this.clusterMeta[this.selectedArchetype]?.color;
      }
    },
    methods: {
      toggleDropdown() { this.showDropdown = !this.showDropdown },
      selectArchetype(i) { this.selectedArchetype = i; this.showDropdown = false },
    },
    mounted() {
      setTimeout(() => this.$emit('scroll-to-character'), 1000)
    }
  }
  </script>
  
  
  
  <style>
  
  .everything {
    
    padding: 2rem;
    
  }
  h2{
    margin: 0px;
    text-align: left;
    color: #000;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #FFF;
    font-family: Jaro;
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .specialText
  {
    
font-family: Jaro;
font-size: 40px;
font-style: normal;
font-weight: 400;
line-height: normal;

  }
  .archetype-micro-container {
    padding-top: 6rem;
    background: black;
    padding: 2rem;

    /* for scrolling onto this */
    width: 100%;
    min-height: 100vh;
    height: auto;
    position: relative;
    z-index: 1;
  }
  .dropdown-container {
    text-transform: uppercase;;
  width: 500px;
  font-family: jaro;
  position: relative; 
    display: flex;
    justify-content: space-between;
    align-items: center;

  border: 2px solid rgba(255, 255, 255, 0.50);
  background: rgba(251, 251, 251, 0.50);
  font-size: 60px;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.dropdown-options {
  width: 100%; /* ✨ Full width matching dropdown */
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
.dropdown-arrow {
  width: 8px; /* adjust size */
  height: 8px;
 
  
}
  .dropdown-option:hover {
    background-color: #222;
  }

/* //charts */
.axis-label {
text-transform: capitalize;
  fill: white;
  font-size: 24px;
  font-family: 'Merriweather', serif;
  font-weight: 900;
}
h4 {
  font-family: 'Merriweather', serif;
  font-size: 24px;
  text-align: left;
}

  </style>
  