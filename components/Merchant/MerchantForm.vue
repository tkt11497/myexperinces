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
                v-model="merchant.name"
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
                v-model="merchant.username"
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
                v-model="merchant.password"
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
                v-model="merchant.city"
                item-text="name"
                return-object
                v-validate="'required'"
                name="city"
                :error="!!errors.first('city')"
                :error-messages="errors.first('city')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Staff"
                :items="staffs"
                v-model="merchant.staff"
                item-text="name"
                return-object
                v-validate="'required'"
                name="staff"
                :error="!!errors.first('staff')"
                :error-messages="errors.first('staff')"
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
  name: "MerchantForm",
  components: {},
  props: {
    cities: {
      type: Array,
      required: true
    },
    zones: {
      type: Array,
      required: true
    },
    staffs: {
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
      merchant: {
        name: "",
        username: "",
        password: "",
        city: {},
        staff: {},
        branches: []
      },
      branch: {
        address: "",
        city: {},
        zone: {},
        phones: [],
        emails: []
      },
      phone: {
        phone: {}
      },
      email: {
        email: {}
      },
      dialogTitle: "New Merchant"
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
        this.dialogTitle === "New Merchant"
          ? "New merchant has been created successfully."
          : "The merchant has been edited successfully.";
      if (this.dialogTitle === "New Merchant") {
        const { data, message, status } = (await api.postMerchants(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putMerchants(this)).data;
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
      this.merchant = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Merchant";
    });
    this.$parent.$on("newForm", () => {
      this.isEditing = false;
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.merchant = {};
      this.dialogTitle = "New Merchant";
    });
  }
};
</script>
