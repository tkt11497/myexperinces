<template>
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
</template>

<script>
import api from "@/assets/utilities/api";
import localforage from "localforage";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
export default {
  middleware: ["auth"],
  data() {
    return {
      isLoading: false,
      isPasswordHidden: true,
      change_password: false
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios } = context.app;

    return {
      merchant: { ...user[0] }
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
    // console.log(this.merchant);
  }
};
</script>
