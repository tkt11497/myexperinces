<template>
  <v-layout>
    <v-flex xs7 style="font-weight: bold">
      {{ titleEn }}
      <br />
      {{ titleMm }}
    </v-flex>
    <v-flex xs5>{{ info.toLocaleString() || 0 }} Ks</v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    titleEn: String,
    titleMm: String,
    info: Number
  }
};
</script>
