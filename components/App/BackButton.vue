<template>
  <v-layout>
    <v-btn color="primary lighten-1" flat @click="$router.push(destinedPath)">
      <v-icon>keyboard_arrow_left</v-icon>Back
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  props: { destinedPath: String }
};
</script>
