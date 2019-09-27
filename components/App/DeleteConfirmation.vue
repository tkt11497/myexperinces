<template>
  <v-dialog v-model="isDelConfirmationOpen" persistent max-width="290">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title
        >Confirmation</v-card-title
      >
      <v-card-text>Are you sure, you want to delete?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="closeDeleteDialog">Cancel</v-btn>
        <v-btn color="red" flat @click="confirmDelete">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isDelConfirmationOpen: Boolean
  },
  methods: {
    confirmDelete() {
      this.$emit("confirmDelete");
    },
    closeDeleteDialog() {
      this.$emit("closeDeleteDialog");
    }
  }
};
</script>
