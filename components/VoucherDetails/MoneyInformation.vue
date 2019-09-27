<template>
  <v-layout mt-2>
    <v-flex xs5>{{ title }}</v-flex>
    <v-flex xs7 style="text-align: right">{{ information }} Kyats</v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    title: String,
    information: String
  }
};
</script>