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
            <v-layout row wrap>
              <!-- :loading="isDeliverySearchLoading"
              :search-input.sync="delivery_search"-->
              <v-autocomplete
                label="Delivery"
                :items="staffs"
                v-model="pickup.opened_by"
                item-text="combinedName"
                return-object
                v-validate="'required'"
                name="staff"
                :error="!!errors.first('staff')"
                :error-messages="errors.first('staff')"
                class="pr-5 mr-5"
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
  name: "PickupForm",
  components: {},
  props: {
    staffs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      pickup: {},
      dialogTitle: "New Pickup",
      isDeliverySearchLoading: false,
      delivery_search: ""
      // staffs: []
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    })
  },
  watch: {
    // delivery_search: _.debounce(async function(val) {
    //   this.isDeliverySearchLoading = true;
    //   this.staffs = (await api.getStaffs(
    //     this.$axios,
    //     this.jwt,
    //     `${process.env.baseUrl}/staffs?search=${val}`
    //   )).data.filter(
    //     staff =>
    //       staff.is_present && (staff.role == 5 || staff.department.id == 5)
    //   );
    //   this.isDeliverySearchLoading = false;
    // }, 1000)
  },
  methods: {
    async onSave() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      const successMessage =
        this.dialogTitle === "New Pickup"
          ? "New pickup has been created successfully."
          : "The pickup has been edited successfully.";
      if (this.dialogTitle === "New Pickup") {
        const { data, message, status } = (await api.postGates(this)).data;
        if (status === 1) {
          this.$parent.$emit("createdNew", data);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.assignPickup(this)).data;
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
      this.pickup = Object.assign({}, item);
      this.pickup.status = item.sender_type;
      this.isFormOpenDialog = true;
      this.dialogTitle = "Pickup Assignment";
    });
  }
};
</script>
