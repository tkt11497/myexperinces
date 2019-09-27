<template>
  <v-dialog v-model="isCloseConfirmationOpen" persistent max-width="290">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title
        >Confirmation</v-card-title
      >
      <v-card-text>Are you sure, you want to close this voucher?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="closeCloseDialog">Cancel</v-btn>
        <v-btn color="red" flat @click="confirmClose">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isCloseConfirmationOpen: Boolean
  },
  methods: {
    confirmClose() {
      this.$emit("confirmClose");
    },
    closeCloseDialog() {
      this.$emit("closeCloseDialog");
    }
  }
};
</script>
