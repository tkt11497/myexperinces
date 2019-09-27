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
              <v-autocomplete
                label="Bus"
                :items="buses"
                v-model="gate.bus"
                item-text="name"
                return-object
                v-validate="'required'"
                name="bus"
                :error="!!errors.first('bus')"
                :error-messages="errors.first('bus')"
              ></v-autocomplete>
            </v-layout>
            <!-- <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Name"
                v-model="gate.name"
                name="name"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('name')"
                :error-messages="errors.first('name')"
              ></v-text-field>
            </v-layout>-->
            <!-- <v-layout>
              <v-text-field browser-autocomplete="off"
                label="Gate Rate"
                v-model="gate.gate_rate"
                name="gate_rate"
                type="text"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('gate_rate')"
                :error-messages="errors.first('gate_rate')"
              ></v-text-field>
            </v-layout>-->
            <v-layout row wrap>
              <v-autocomplete
                label="Gate Debit"
                :items="gate_debit"
                v-model="gate.gate_debit"
                item-text="name"
                item-value="value"
                v-validate="'required'"
                name="gate_debit"
                :error="!!errors.first('gate_debit')"
                :error-messages="errors.first('gate_debit')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Bus Station"
                :items="bus_stations"
                v-model="gate.bus_station"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="bus_station"
                :error="!!errors.first('bus_station')"
                :error-messages="errors.first('bus_station')"
              ></v-autocomplete>
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
  name: "GateForm",
  components: {},
  props: {
    bus_stations: {
      type: Array,
      required: true
    },
    buses: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      gate_debit: [{ name: "No", value: false }, { name: "Yes", value: true }],
      gate: {
        name: "",
        gate_debit: "",
        bus_station: {},
        bus: {}
      },
      dialogTitle: "New Gate"
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
        this.dialogTitle === "New Gate"
          ? "New gate has been created successfully."
          : "The gate has been edited successfully.";
      if (this.dialogTitle === "New Gate") {
        const { data, message, status } = (await api.postGates(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putGates(this)).data;
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
      this.gate = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Gate";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.gate = {};
      this.dialogTitle = "New Gate";
    });
  }
};
</script>
