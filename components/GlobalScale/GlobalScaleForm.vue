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
                label="CBM"
                v-model="global_scale.cbm"
                name="cbm"
                type="text"
                v-validate="{ required: true, regex: /^\d{1,14}(\.\d{1,2})?$/ }"
                :error="!!errors.first('cbm')"
                :error-messages="errors.first('cbm')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Support Weight"
                v-model="global_scale.support_weight"
                name="support_weight"
                type="text"
                v-validate="{ required: true, regex: /^\d{1,14}(\.\d{1,2})?$/ }"
                :error="!!errors.first('support_weight')"
                :error-messages="errors.first('support_weight')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Max Weight"
                v-model="global_scale.max_weight"
                name="max_weight"
                type="text"
                v-validate="{ required: true, regex: /^\d{1,14}(\.\d{1,2})?$/ }"
                :error="!!errors.first('max_weight')"
                :error-messages="errors.first('max_weight')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Description"
                v-model="global_scale.description"
                name="description"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('description')"
                :error-messages="errors.first('description')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Description MM"
                v-model="global_scale.description_mm"
                name="description_mm"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('description_mm')"
                :error-messages="errors.first('description_mm')"
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
  name: "GlobalScaleForm",
  components: {},
  props: {},
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      global_scale_debit: [
        { name: "No", value: false },
        { name: "Yes", value: true }
      ],
      global_scale: {
        name: "",
        global_scale_debit: "",
        bus_station: {},
        bus: {}
      },
      dialogTitle: "New Global Scale"
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
        this.dialogTitle === "New Global Scale"
          ? "New global_scale has been created successfully."
          : "The global_scale has been edited successfully.";
      if (this.dialogTitle === "New Global Scale") {
        const { data, message, status } = (await api.postGlobalScales(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putGlobalScales(
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
      this.global_scale = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Global Scale";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.global_scale = {};
      this.dialogTitle = "New Global Scale";
    });
  }
};
</script>
