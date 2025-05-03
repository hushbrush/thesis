<template>
  <div class="epic-comparer">
    <label for="titlePicker">Choose a text:</label>
    <select id="titlePicker" v-model="selectedTitle">
      <option 
        v-for="title in uniqueTitles" 
        :key="title" 
        :value="title"
      >
        {{ title }}
      </option>
    </select>

    <h2 v-if="selectedTitle">
      Quote‑Position Bars for “{{ selectedTitle }}”
    </h2>

    <div 
      v-for="item in filteredItems" 
      :key="item.character" 
      class="bar-wrapper"
    >
      <h3>{{ item.character }}</h3>
      <text-bar :item="item" :height="50" @hover-quote="onHoverQuote" />
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
    items: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      selectedTitle: ''
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
      return this.items
        .filter(i => i.normalized_title === this.selectedTitle)
        .map(i => {
          const totalLen = i.quotes_n_loc
            .filter(([t]) => t && t.length)
            .reduce((sum, [t]) => sum + t.length, 0);
          return { item: i, totalLen };
        })
        .sort((a, b) => b.totalLen - a.totalLen)
        .map(w => w.item);
    }
  },

  mounted() {
    if (this.uniqueTitles.length) {
      this.selectedTitle = this.uniqueTitles[0];
    }
  },

  methods: {
    onHoverQuote(text) {
      this.$emit('hover-quote', text);
    }
  }
};
</script>

<style scoped>
.epic-comparer {
  padding: 1rem;
  background: #111;
  color: #fff;
}
label {
  margin-right: 0.5rem;
}
select {
  margin-bottom: 1rem;
}
.bar-wrapper {
  margin-bottom: 2rem;
}
.bar-wrapper h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
  text-transform: capitalize;
}
</style>
