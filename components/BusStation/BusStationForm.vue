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
                label="Name"
                v-model="bus_station.name"
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
                label="Number Of Gates"
                v-model="bus_station.number_of_gates"
                name="number_of_gates"
                type="number"
                v-validate="'required|numeric'"
                :error="!!errors.first('number_of_gates')"
                :error-messages="errors.first('number_of_gates')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Delivery Rate"
                v-model="bus_station.delivery_rate"
                name="delivery_rate"
                type="text"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('delivery_rate')"
                :error-messages="errors.first('delivery_rate')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="City"
                :items="cities"
                v-model="bus_station.city"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="city"
                @change="onSelectedCity"
                :error="!!errors.first('city')"
                :error-messages="errors.first('city')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Zone"
                :items="selectedZones"
                v-model="bus_station.zone"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="zone"
                :error="!!errors.first('zone')"
                :error-messages="errors.first('zone')"
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
  name: "BusStationForm",
  components: {},
  props: {
    cities: {
      type: Array,
      required: true
    },
    zones: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      bus_station: {
        name: "",
        number_of_gates: "",
        delivery_rate: "",
        city: {},
        zone: {}
      },
      dialogTitle: "New Bus Station",
      selectedZones: []
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
        this.dialogTitle === "New Bus Station"
          ? "New bus_station has been created successfully."
          : "The bus_station has been edited successfully.";
      if (this.dialogTitle === "New Bus Station") {
        const { data, message, status } = (await api.postBusStations(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putBusStations(this)).data;
        if (status === 1) {
          this.$parent.$emit("updatedForm", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      }
      this.closeFormDialog(this);
    },
    closeForm() {
      this.closeFormDialog(this);
    },
    onSelectedCity() {
      this.selectedZones = this.zones.filter(
        zone => this.bus_station.city === zone.city.id
      );
    }
  },
  mounted() {
    this.$parent.$on("editForm", item => {
      this.$validator.reset();
      this.bus_station = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Bus Station";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.bus_station = {};
      this.dialogTitle = "New Bus Station";
    });
  }
};
</script>
