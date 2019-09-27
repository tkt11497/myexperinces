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
                label="Status"
                v-model="tracking_status.status"
                name="status"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('status')"
                :error-messages="errors.first('status')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Status MM"
                v-model="tracking_status.status_mm"
                name="status_mm"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('status_mm')"
                :error-messages="errors.first('status_mm')"
              ></v-text-field>
            </v-layout>
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
  name: "TrackingStatusForm",
  components: {},
  props: {},
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      tracking_status: {
        status: "",
        status_mm: ""
      },
      dialogTitle: "New Tracking Status"
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
        this.dialogTitle === "New Tracking Status"
          ? "New tracking status has been created successfully."
          : "The tracking status has been edited successfully.";
      if (this.dialogTitle === "New Tracking Status") {
        const { data, message, status } = (await api.postTrackingStatuses(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putTrackingStatuses(
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
      this.tracking_status = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Tracking Status";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.tracking_status = {};
      this.dialogTitle = "New Tracking Status";
    });
  }
};
</script>
