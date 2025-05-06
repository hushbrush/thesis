<template>
  <div class="epic-comparer">
    <!-- Custom dropdown replacing the native <select> -->
      <div
          :class="[
            'dropdown-container',
            side === 'right' ? 'align-right' : 'align-left'
          ]"
        >
      <div @click="toggleDropdown" class="dropdown-label-wrapper">
        <span class="dropdown-label" :style="{ color: selectedColor }">
          {{ selectedTitle || 'Select Text' }}
        </span>
        <span class="dropdown-arrow" :style="{ color: selectedColor }">▽</span>
      </div>
      <div v-if="showDropdown" class="dropdown-options">
        <div
          class="dropdown-option"
          v-for="(title, idx) in uniqueTitles"
          :key="idx"
          @click="selectTitle(title)"
        >
          {{ title }}
        </div>
      </div>
    </div>

    <!-- Bars for the selected title -->
    <div
      v-for="item in filteredItems"
      :key="item.character"
      class="bar-wrapper"
    >
      <h3>{{ item.character }}</h3>
      <text-bar :item="item" :height="50" :side="side" @hover-quote="onHoverQuote" />
    </div>

    <p v-if="selectedTitle && filteredItems.length === 0">
      No items found with normalized_title = “{{ selectedTitle }}”.
    </p>
  </div>
</template>

<script>
import TextBar from './textBar.vue';

export default {
  name: 'EpicComparer',
  components: { TextBar },
  props: {
    items: { type: Array, required: true },
    side:  { type: String, default: 'left' }
  },
  data() {
    return {
      selectedTitle: '',
      showDropdown: false,
    };
  },
  computed: {
    uniqueTitles() {
      return Array.from(
        new Set(this.items.map(i => i.normalized_title))
      ).sort();
    },
    filteredItems() {
      if (!this.selectedTitle) return [];
      return this.items.filter(
        i => i.normalized_title === this.selectedTitle
      );
    },
    selectedColor() {
      // default color; swap in clusterMeta logic if desired
      return '#ffffff';
    }
  },
  mounted() {
    if (this.uniqueTitles.length) {
      this.selectedTitle = this.uniqueTitles[0];
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectTitle(title) {
      this.selectedTitle = title;
      this.showDropdown = false;
    },
    onHoverQuote(text) {
      this.$emit('hover-quote', text);
    }
  }
};
</script>

<style scoped>
.epic-comparer {
  padding: 1rem;
  background: #000000;
  color: #fff;
  border-radius: 8px;
  /* border: 0.1px solid #fff; */
}

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

.bar-wrapper {
  margin-bottom: 2rem;
}


/* push the left-column dropdown to the left edge */
.dropdown-container.align-left {
  margin-right: auto;
}

/* push the right-column dropdown to the right edge */
.dropdown-container.align-right {
  margin-left: auto;
}

</style>
