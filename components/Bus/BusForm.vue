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
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                v-validate="'required'"
                name="name"
                type="text"
                v-model="bus.name"
                label="Name"
                :error="!!errors.first('name')"
                :error-messages="errors.first('name')"
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
  name: "BusForm",
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      bus: {
        name: ""
      },
      dialogTitle: "New Bus"
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
        this.dialogTitle === "New Bus"
          ? "New bus has been created successfully."
          : "The bus has been edited successfully.";
      if (this.dialogTitle === "New Bus") {
        const { data, message, status } = (await api.postBuses(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putBuses(this)).data;
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
      this.bus = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Bus";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.bus = {};
      this.dialogTitle = "New Bus";
    });
  }
};
</script>
