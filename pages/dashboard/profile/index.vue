<template>
  <v-container fluid>
    <v-layout row wrap mt-3>
      <v-flex offset-xs3 xs6>
        <v-card>
          <form @submit.prevent="onSave">
            <v-card-title>
              <!-- <span class="headline">{{ user[0].name }}</span> -->
              <v-progress-linear v-if="isLoading" color="primary" :indeterminate="true"></v-progress-linear>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
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
                  <v-btn
                    color="primary"
                    @click="change_password = !change_password "
                    class="ml-0"
                  >{{ change_password ? "Cancel" : "Change Password" }}</v-btn>
                </v-layout>
                <v-layout row wrap>
                  <v-text-field
                    v-show="change_password"
                    browser-autocomplete="off"
                    :append-icon="
                  isPasswordHidden ? 'visibility' : 'visibility_off'
                "
                    @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                    :type="isPasswordHidden ? 'password' : 'text'"
                    label="Old Password"
                    v-model="merchant.old_password"
                    name="old_password"
                    v-validate="{ required: this.change_password }"
                    :error="!!errors.first('old_password')"
                    :error-messages="errors.first('old_password')"
                  ></v-text-field>
                </v-layout>
                <v-layout row wrap>
                  <v-text-field
                    v-show="change_password"
                    browser-autocomplete="off"
                    :append-icon="
                  isPasswordHidden ? 'visibility' : 'visibility_off'
                "
                    @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                    :type="isPasswordHidden ? 'password' : 'text'"
                    label="New Password"
                    v-model="merchant.new_password"
                    name="new_password"
                    v-validate="{ required: this.change_password }"
                    :error="!!errors.first('new_password')"
                    :error-messages="errors.first('new_password')"
                  ></v-text-field>
                </v-layout>
                <v-layout row wrap>
                  <v-text-field
                    v-show="change_password"
                    browser-autocomplete="off"
                    :append-icon="
                  isPasswordHidden ? 'visibility' : 'visibility_off'
                "
                    @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                    :type="isPasswordHidden ? 'password' : 'text'"
                    label="new_password_confirmation"
                    v-model="merchant.new_password_confirmation"
                    name="new_password_confirmation"
                    v-validate="{ required: this.change_password }"
                    :error="!!errors.first('new_password_confirmation')"
                    :error-messages="errors.first('new_password_confirmation')"
                  ></v-text-field>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- <v-btn color="primary" flat @click="closeForm()">Cancel</v-btn> -->
              <v-btn color="primary" type="submit">Save</v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap my-3>
      <v-flex xs2 offset-xs9>
        <v-layout justify-end>
          <v-btn @click="onCreate" color="primary" dark class="green ma-0">Create Merchant Associate</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              browser-autocomplete="off"
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="merchant_associates"
            :search="search"
            :pagination.sync="pagination"
            :rows-per-page-items="[25]"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.label }}</td>
              <!-- <td>{{ props.item.city.name }}</td> -->
              <td>{{ props.item.zone.name }}</td>
              <td>{{ props.item.phones.join(", ") }}</td>
              <td>{{ props.item.emails.join(", ") || '--Empty--' }}</td>
              <td>{{ props.item.account_name || '--Empty--'}}</td>
              <td>{{ props.item.account_no || '--Empty--'}}</td>
              <td>{{ props.item.address }}</td>
              <td class="justify-center layout px-0" wrap>
                <v-btn color="blue" flat icon @click="onEdit(props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn color="red" flat icon @click="onDeleteItem(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>

    <MerchantAssociateForm :merchant="merchant" :cities="cities" :zones="zones"></MerchantAssociateForm>
    <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
      {{ snackbarMessage }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <AppDeleteConfirmation
      :isDelConfirmationOpen="isDeleteDialogOpen"
      @confirmDelete="confirmDelete"
      @closeDeleteDialog="closeDelete"
    ></AppDeleteConfirmation>
  </v-container>
</template>

<script>
import _ from "lodash";
import api from "@/assets/utilities/api";
import localforage from "localforage";
import { mapGetters, mapActions } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
import MerchantAssociateForm from "@/components/Merchant/MerchantAssociateForm";
import AppDeleteConfirmation from "@/components/App/DeleteConfirmation";

export default {
  components: {
    AppDeleteConfirmation,
    MerchantAssociateForm
  },
  middleware: ["auth"],
  data() {
    return {
      isLoading: false,
      isPasswordHidden: true,
      change_password: false,
      snackbar: false,
      snackbarMessage: "",
      deletingId: null,
      isDeleteDialogOpen: false,
      search: "",
      merchant_associates: [],
      pagination: {
        sortBy: "id",
        descending: true
      },
      headers: [
        { text: "Branch Name", value: "label" },
        // { text: "City", value: "city.name" },
        { text: "Zone", value: "zone.name" },
        { text: "Phone", value: "phones" },
        { text: "Email", value: "emails" },
        { text: "Account Name", value: "account_name" },
        { text: "Account Number", value: "account_no" },
        { text: "Address", value: "address" },
        { text: "Actions", value: "action", sortable: false, width: "50" }
      ]
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios } = context.app;

    let responses = await Promise.all([
      localforage.getItem("stored:cities"),
      localforage.getItem("stored:zones")
    ]);

    let cities = responses[0];
    let zones = responses[1];

    user[0].branches.forEach(branch => {
      branch.account_name = _.last(branch.account_informations)
        ? _.last(branch.account_informations).account_name
        : "";
      branch.account_no = _.last(branch.account_informations)
        ? _.last(branch.account_informations).account_name
        : "";
    });

    return {
      cities,
      zones,
      merchant: { ...user[0] },
      merchant_associates: user[0].branches
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "auth/user"
    })
  },
  methods: {
    ...mapActions({
      setUser: "auth/setUser",
      resetAuth: "auth/resetAuth",
      setTitle: "title/setTitle"
    }),
    async onSave() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      const successMessage = "Update Successfully!";

      const { data, message, status } = (await api.updateMerchant(this)).data;
      if (status === 1) {
        this.setUser([this.merchant]);
        this.setTitle(this.merchant.name);
        await localforage.setItem("user", [this.merchant]);
        if (this.change_password) {
          await localforage.clear();
          this.$router.push("/login");
        }
      }
      this.handleStatus({ status, message, that: this, successMessage });
    },
    closeDelete() {
      this.closeDeleteDialog(this);
    },
    onCreate() {
      this.$emit("newForm");
    },
    onDeleteItem(item) {
      this.onDelete(this, item);
      this.isDeleteDialogOpen = true;
    },
    async confirmDelete() {
      const successMessage =
        "The merchant associate has been deleted successfully";
      const { data, status, message } = (await api.deleteMerchantAssociate(
        this
      )).data;
      if (status === 1) {
        const foundIndex = this.merchant_associates.findIndex(
          merchant_associate => merchant_associate.id === this.deletingId
        );
        this.merchant_associates.splice(foundIndex, 1);
      }
      this.handleStatus({ status, message, that: this, successMessage });
      this.closeDeleteDialog(this);
    },
    onEdit(item) {
      this.$emit("editForm", item);
    }
  },
  watch: {
    change_password: {
      handler(val) {
        if (!this.change_password) {
          this.merchant.old_password = "";
          this.merchant.new_password = "";
          this.merchant.new_password_confirmation = "";
        }
      }
    }
  },
  created() {
    this.setTitle(this.merchant.name);
  },
  mounted() {
    this.$on("updatedForm", data => {
      const foundIndex = this.merchant_associates.findIndex(
        merchant_associate => merchant_associate.id === data.id
      );
      this.merchant_associates = data;
    });
    this.$on("createdNew", data => {
      this.merchant_associates = data;
    });
    this.$on("handleStatus", ({ status, message, successMessage }) => {
      this.handleStatus({ status, message, that: this, successMessage });
    });
  }
};
</script>
