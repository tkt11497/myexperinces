<template>
  <div>
    <v-card-title>
      <slot></slot>
      <v-spacer></v-spacer>
      <v-text-field
        browser-autocomplete="off"
        v-model="search"
        @input="onInput"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      search: null
    };
  },
  methods: {
    onInput: function(event) {
      this.$emit("termChange", event);
    }
  }
};
</script>
