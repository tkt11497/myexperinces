<template>
  <v-dialog persistent v-model="isFormOpenDialog" max-width="500px">
    <v-card>
      <form @submit.prevent="onSave">
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
          <v-progress-linear v-if="isLoading" color="primary" :indeterminate="true"></v-progress-linear>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <!-- todo: -->
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Name"
                v-model="payment_status.name"
                name="name"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('name')"
                :error-messages="errors.first('name')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Name MM"
                v-model="payment_status.name_mm"
                name="name_mm"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('name_mm')"
                :error-messages="errors.first('name_mm')"
              ></v-text-field>
            </v-layout>
            <!-- <v-layout row wrap>
              <v-text-field browser-autocomplete="off"                 label="Description"
                v-model="payment_status.description"
                name="description"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('description')"
                :error-messages="errors.first('description')"
              ></v-text-field>
            </v-layout>-->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="closeForm()">Cancel</v-btn>
          <v-btn color="primary" type="submit">Save</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "@/assets/utilities/api";
import { mapGetters } from "vuex";
export default {
  name: "PaymentStatusForm",
  components: {},
  props: {},
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      payment_status: {
        name: "",
        name_mm: "",
        description: ""
      },
      dialogTitle: "New Payment Status"
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    })
  },
  methods: {
    async onSave() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      const successMessage =
        this.dialogTitle === "New Payment Status"
          ? "New payment status has been created successfully."
          : "The payment status has been edited successfully.";
      if (this.dialogTitle === "New Payment Status") {
        const { data, message, status } = (await api.postPaymentStatuses(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putPaymentStatuses(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("updatedForm", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      }
      this.closeFormDialog(this);
    },
    closeForm() {
      this.closeFormDialog(this);
    }
  },
  mounted() {
    this.$parent.$on("editForm", item => {
      this.$validator.reset();
      this.payment_status = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Payment Status";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.payment_status = {};
      this.dialogTitle = "New Payment Status";
    });
  }
};
</script>
