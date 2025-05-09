<template>
   <div class="archetype-micro-container" ref="container">
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
      <!-- :style="{ color: selectedColor }" -->
      <h4 class = "archText" > 
          {{ clusterMeta[selectedArchetype]?.description || '' }}
        </h4>
      <div class="everything">
            <!-- All charts use the same selectedArchetype + clusterMeta -->
              
            <h2>Important Characteristics</h2>
            <archetype-grid :key="selectedArchetype"         
      :selectedArchetype="selectedArchetype"
      :clusterMeta="clusterMeta"/>
            <h2 class="h2">
                Explore other characteristics by the 
                <span class="specialText" :style="{ color: selectedColor }">{{ selectedArchetypeName }}</span>
                characteristic
            </h2>
            <h4 class="axisLabels2">
              X axis = Highest Characteristic<br>
              Y axis = Lowest Characteristic
            </h4>

            

            <archetype-scatter
      :key="selectedArchetype + '-scatter'"
      :selectedArchetype="selectedArchetype"
      :clusterMeta="clusterMeta"
    />
            
            <h2 class="h2">
                Origin of 
                <span class="specialText" :style="{ color: selectedColor }">{{ selectedArchetypeName }}</span>
                : Who came first?
            </h2>
            
          
            <archetype-lineage
      :key="selectedArchetype + '-lineage'"
      :selectedArchetype="selectedArchetype"
      :clusterMeta="clusterMeta"
    />
      </div>
      <div ref="sentinel" style="height:1px"></div>
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
        selectedArchetype: this.initialSelected,  // seed from prop
        showDropdown: false,
        scrollContainer: null
      }
    },
    computed: {
      
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

  props: {
    initialSelected: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // in case you ever change `archetypeIndex` in the parent after mount:
    initialSelected(newVal) {
      this.selectedArchetype = newVal
    }
  },
    methods: {
      
      toggleDropdown() {
        console.log('[ArchetypeMicro] toggleDropdown → before:', this.showDropdown);
        this.showDropdown = !this.showDropdown;
        console.log('[ArchetypeMicro] toggleDropdown → after:', this.showDropdown);
      },
      selectArchetype(i) {
          console.log('[ArchetypeMicro] selectArchetype → picking index', i);
          this.selectedArchetype = i;
          this.showDropdown = false;
          console.log('[ArchetypeMicro] selectArchetype → now selectedArchetype =', this.selectedArchetype);
          
        },
        onScroll() {
        const section = this.scrollContainer;
        const sentinel = this.$refs.sentinel;
        // when sentinel’s top comes into view at bottom of section:
        if (section.scrollTop + section.clientHeight >= sentinel.offsetTop - 2) {
          console.log('[ArchetypeMicro] reached bottom; emitting scroll-to-character');
          this.$emit('scroll-to-character');
          section.removeEventListener('scroll', this.onScroll);
      }

    
    }},
    mounted() {
        console.log('[ArchetypeMicro] mounted; initialSelected =', this.initialSelected);
        // find the parent <section> that actually scrolls:
        const section = this.$el.closest('.archetype-micro-scroll');
        if (section) {
          console.log('[ArchetypeMicro] attaching scroll listener to section');
          this.scrollContainer = section;
          section.addEventListener('scroll', this.onScroll);
        } else {
          console.warn('[ArchetypeMicro] could not find .archetype-micro-scroll');
        }
    },
    beforeUnmount() {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener('scroll', this.onScroll);
      }
  }
}
  
  </script>
  
  
  
  <style>
  
  .everything {
    
    padding:2rem;
    
  }
  h2{
    margin-top: 20px;
    margin-bottom: 0px;
    text-align: left;
    color: #000;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #FFF;
    font-family: Jaro;
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.03em;

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
width: 100vw;
max-width: 100vw;
min-height: 100vh;
padding: 2rem;
background: black;
overflow-x: hidden;
height: auto;
position: relative;
z-index: 1;
}


.axisLabels2{
  font-family: Jaro;
  color: #fff;
  font-size: 28px;
  text-align: left;
  margin: 0px;

}

/* //charts */
.axis-label {
text-transform: capitalize;
  fill: white;
  font-size: 24px;
  font-family: Oswald, sans-serif;
  font-weight: 900;
}
.archText {
  font-family: 'Oswald', sans-serif;
  font-weight: 400;
  font-size: 28px;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 0px;
  line-height: 1.14;
  letter-spacing: 0.03em;
  width: 1250px;
  color: white;
}
.micro‐wrapper {
  position: sticky;
  top: 0/* the height of your nav or header, or 0 */
}


.dropdown-option:hover {
  background-color: #787878;
}
  </style>
  