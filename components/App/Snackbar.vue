<template>
  <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
    {{ snackbarMessage }}
    <!-- <v-btn color="pink" flat @click="snackbar = false">Close</v-btn> -->
  </v-snackbar>
</template>

<script>
export default {
  props: {
    snackbar: Boolean,
    snackbarMessage: String
  }
};
</script>
