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
                label="Route"
                :items="routes"
                v-model="bus_drop_off.route"
                item-text="route_name"
                return-object
                v-validate="'required'"
                name="route"
                @change="onChangeRoute"
                :error="!!errors.first('route')"
                :error-messages="errors.first('route')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Bus Station"
                :items="selectedBusStations"
                v-model="selectedBusStation"
                item-text="name"
                return-object
                name="bus_station"
                @change="onChangeBusStation"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Gate"
                :items="selectedGates"
                v-model="bus_drop_off.gate"
                item-text="name"
                return-object
                v-validate="'required'"
                name="gate"
                :error="!!errors.first('gate')"
                :error-messages="errors.first('gate')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Global Scale"
                :items="global_scales"
                v-model="bus_drop_off.global_scale"
                item-text="description"
                return-object
                v-validate="'required'"
                name="global_scale"
                :error="!!errors.first('global_scale')"
                :error-messages="errors.first('global_scale')"
              ></v-autocomplete>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Base Rate"
                v-model="bus_drop_off.base_rate"
                name="base_rate"
                type="number"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('base_rate')"
                :error-messages="errors.first('base_rate')"
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Agent Base Rate"
                v-model="bus_drop_off.agent_base_rate"
                name="agent_base_rate"
                type="number"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('agent_base_rate')"
                :error-messages="errors.first('agent_base_rate')"
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Salt"
                v-model="bus_drop_off.salt"
                name="salt"
                type="number"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('salt')"
                :error-messages="errors.first('salt')"
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
  name: "BusDropOffForm",
  components: {},
  props: {
    routes: {
      type: Array,
      required: true
    },
    gates: {
      type: Array,
      required: true
    },
    global_scales: {
      type: Array,
      required: true
    },
    bus_stations: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      bus_drop_off: {
        base_rate: "",
        agent_base_rate: "",
        salt: "",
        agent_salt: "",
        route: {},
        gate: {},
        global_scale: {}
      },
      selectedBusStations: [],
      selectedBusStation: {},
      selectedGates: this.gates,
      dialogTitle: "New Bus Drop Of"
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    })
  },
  methods: {
    onChangeRoute() {
      this.selectedBusStations = this.bus_stations.filter(
        bus_station =>
          bus_station.city.id === this.bus_drop_off.route.origin_city.id
      );
    },
    onChangeBusStation() {
      this.selectedGates = this.gates.filter(
        gate => gate.bus_station.id === this.selectedBusStation.id
      );
    },
    async onSave() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      const successMessage =
        this.dialogTitle === "New Bus Drop Off"
          ? "New bus drop off has been created successfully."
          : "The bus drop off has been edited successfully.";
      if (this.dialogTitle === "New Bus Drop Off") {
        const { data, message, status } = (await api.postBusDropOffs(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putBusDropOffs(this)).data;
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
      this.bus_drop_off = Object.assign({}, item);
      let selecedRoute = this.routes.find(
        route => route.id === this.bus_drop_off.route.id
      );
      this.selectedBusStations = this.bus_stations.filter(
        bus_station => bus_station.city.id === selecedRoute.origin_city.id
      );
      // this.selectedBusStation = this.bus_stations.find(
      //   bus_station => bus_station.city.id === selecedRoute.origin_city.id
      // );
      this.selectedBusStation = {};
      this.selectedGates = this.gates;
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Bus Drop Off";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.bus_drop_off = {};
      this.selectedBusStation = {};
      this.dialogTitle = "New Bus Drop Off";
    });
  }
};
</script>
