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
            <!-- <v-layout>
              <v-text-field browser-autocomplete="off"                 v-validate="'required'"
                name="route_name"
                type="text"
                v-model="route.route_name"
                label="Route Name"
                :error="!!errors.first('route_name')"
                :error-messages="errors.first('route_name')"
              ></v-text-field>
            </v-layout>-->
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Travel Day"
                v-model="route.travel_day"
                name="travel_day"
                type="text"
                v-validate="{ required: true, regex: /^\d{1,14}(\.\d{1,2})?$/ }"
                :error="!!errors.first('travel_day')"
                :error-messages="errors.first('travel_day')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Origin City"
                :items="cities"
                v-model="route.origin_city"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="origin_city"
                :error="!!errors.first('origin_city')"
                :error-messages="errors.first('origin_city')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Destination City"
                :items="cities"
                v-model="route.destination_city"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="destination_city"
                :error="!!errors.first('destination_city')"
                :error-messages="errors.first('destination_city')"
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
  name: "RouteForm",
  components: {},
  props: {
    cities: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      route: {
        route_name: "",
        travel_day: "",
        origin_city: {},
        destination_city: {}
      },
      dialogTitle: "New Route"
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
        this.dialogTitle === "New Route"
          ? "New route has been created successfully."
          : "The route has been edited successfully.";
      if (this.dialogTitle === "New Route") {
        const { data, message, status } = (await api.postRoutes(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putRoutes(this)).data;
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
      this.route = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Route";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.route = {};
      this.dialogTitle = "New Route";
    });
  }
};
</script>
