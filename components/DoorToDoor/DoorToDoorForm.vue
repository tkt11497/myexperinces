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
                v-model="door_to_door.route"
                item-text="route_name"
                item-value="id"
                v-validate="'required'"
                name="route"
                :error="!!errors.first('route')"
                :error-messages="errors.first('route')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Global Scale"
                :items="global_scales"
                v-model="door_to_door.global_scale"
                item-text="description"
                item-value="id"
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
                v-model="door_to_door.base_rate"
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
                v-model="door_to_door.agent_base_rate"
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
                v-model="door_to_door.salt"
                name="salt"
                type="number"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('salt')"
                :error-messages="errors.first('salt')"
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Agent Salt"
                v-model="door_to_door.agent_salt"
                name="agent_salt"
                type="number"
                v-validate="'required|decimal:2'"
                :error="!!errors.first('agent_salt')"
                :error-messages="errors.first('agent_salt')"
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
  name: "DoorToDoorForm",
  components: {},
  props: {
    routes: {
      type: Array,
      required: true
    },
    global_scales: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      door_to_door: {
        base_rate: "",
        agent_base_rate: "",
        salt: "",
        agent_salt: "",
        route: {},
        global_scale: {}
      },
      dialogTitle: "New Door To Door"
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
        this.dialogTitle === "New Door To Door"
          ? "New door to door has been created successfully."
          : "The door to door has been edited successfully.";
      if (this.dialogTitle === "New Door To Door") {
        const { data, message, status } = (await api.postDoorToDoors(
          this
        )).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putDoorToDoors(this)).data;
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
      this.door_to_door = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Door To Door";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.door_to_door = {};
      this.dialogTitle = "New Door To Door";
    });
  }
};
</script>
