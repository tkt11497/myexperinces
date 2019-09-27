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
                v-model="staff.name"
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
                v-model="staff.username"
                name="username"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('username')"
                :error-messages="errors.first('username')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <!-- v-show="!this.isEditing" -->
              <v-text-field
                browser-autocomplete="off"
                :append-icon="
                  isPasswordHidden ? 'visibility' : 'visibility_off'
                "
                @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                :type="isPasswordHidden ? 'password' : 'text'"
                label="Password"
                v-model="staff.password"
                name="password"
                v-validate="{ required: !this.isEditing }"
                :error="!!errors.first('password')"
                :error-messages="errors.first('password')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Phone No"
                v-model="staff.phone"
                name="phone"
                type="text"
                :error="!!errors.first('phone')"
                :error-messages="errors.first('phone')"
              ></v-text-field>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Role"
                :items="roles"
                v-model="staff.role"
                item-text="name"
                item-value="id"
                v-validate="'required'"
                name="role"
                @change="onChangeDelivery"
                :error="!!errors.first('role')"
                :error-messages="errors.first('role')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                label="Department"
                :items="departments"
                v-model="staff.department"
                item-text="department"
                item-value="id"
                v-validate="'required'"
                name="department"
                @change="onChangeDelivery"
                :error="!!errors.first('department')"
                :error-messages="errors.first('department')"
              ></v-autocomplete>
            </v-layout>
            <v-layout row wrap>
              <v-autocomplete
                v-show="showForm"
                label="Zone"
                :items="zones"
                v-model="staff.zone"
                item-text="name"
                item-value="id"
                v-validate="{ required: this.showForm }"
                name="zone"
                :error="!!errors.first('zone')"
                :error-messages="errors.first('zone')"
              ></v-autocomplete>
            </v-layout>
            <v-layout>
              <v-autocomplete
                v-show="showForm"
                label="Courier Type"
                :items="courier_types"
                v-model="staff.courier_type"
                item-text="name"
                item-value="id"
                v-validate="{ required: this.showForm }"
                name="courier_type"
                :error="!!errors.first('courier_type')"
                :error-messages="errors.first('courier_type')"
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
  name: "StaffForm",
  components: {},
  props: {
    roles: {
      type: Array,
      required: true
    },
    departments: {
      type: Array,
      required: true
    },
    zones: {
      type: Array,
      required: true
    },
    courier_types: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isPasswordHidden: true,
      isEditing: false,
      showForm: false,
      isFormOpenDialog: false,
      isLoading: false,
      staff: {
        name: "",
        username: "",
        password: "",
        phone: "",
        role: {},
        department: {},
        zone: {},
        courier_type: {}
      },
      dialogTitle: "New Staff"
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    })
  },
  methods: {
    onChangeDelivery() {
      this.staff.department == 5 || this.staff.role == 5
        ? (this.showForm = true)
        : (this.showForm = false);
    },
    async onSave() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      const successMessage =
        this.dialogTitle === "New Staff"
          ? "New staff has been created successfully."
          : "The staff has been edited successfully.";
      if (this.dialogTitle === "New Staff") {
        const { data, message, status } = (await api.postStaffs(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
          this.showForm = false;
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putStaffs(this)).data;
        if (status === 1) {
          this.$parent.$emit("updatedForm", data);
          this.showForm = false;
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
      this.staff = Object.assign({}, item);
      this.isFormOpenDialog = true;
      this.dialogTitle = "Edit Staff";
    });
    this.$parent.$on("newForm", () => {
      this.isEditing = false;
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.staff = {};
      this.dialogTitle = "New Staff";
    });
  }
};
</script>
