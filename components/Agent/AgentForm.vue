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
                v-model="agent.name"
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
                label="User Name"
                v-model="agent.username"
                name="username"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('username')"
                :error-messages="errors.first('username')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                v-show="!this.isEditing"
                browser-autocomplete="off"
                :append-icon="
                  isPasswordHidden ? 'visibility' : 'visibility_off'
                "
                @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                :type="isPasswordHidden ? 'password' : 'text'"
                label="Password"
                v-model="agent.password"
                name="password"
                v-validate="{ required: !this.isEditing }"
                :error="!!errors.first('password')"
                :error-messages="errors.first('password')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="City"
                :items="cities"
                v-model="agent.city"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="city"
                :error="!!errors.first('city')"
                :error-messages="errors.first('city')"
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
  name: "AgentForm",
  components: {},
  props: {
    cities: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isPasswordHidden: true,
      isEditing: false,
      isFormOpenDialog: false,
      isLoading: false,
      agent: {
        name: "",
        username: "",
        password: "",
        city: {}
      },
      dialogTitle: "New Agent"
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
        this.dialogTitle === "New Agent"
          ? "New agent has been created successfully."
          : "The agent has been edited successfully.";
      if (this.dialogTitle === "New Agent") {
        const { data, message, status } = (await api.postAgents(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putAgents(this)).data;
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
      this.isEditing = true;
      this.$validator.reset();
      this.agent = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Agent";
    });
    this.$parent.$on("newForm", () => {
      this.isEditing = false;
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.agent = {};
      this.dialogTitle = "New Agent";
    });
  }
};
</script>
