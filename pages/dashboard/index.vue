<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs2 offset-xs1>
        <v-layout align-center row wrap>
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="date"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            @input="onChangeDate"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                browser-autocomplete="off"
                v-model="date"
                label="Pick Date"
                prepend-icon="event"
                readonly
                v-on="on"
                class="pr-1 mr-1"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-layout row wrap align-start justify-start>
          <v-flex xs3>
            <v-card class="pa-1 ma-2">
              <v-card-title primary-title>
                <h3 class="title headline">Total Pickups</h3>
              </v-card-title>
              <v-card-text>
                <p class="subheading text-xs-center">{{ total_pickups_count }} Vouchers</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs3>
            <v-card class="pa-1 ma-2">
              <v-card-title primary-title>
                <h3 class="title headline">Total Vouchers</h3>
              </v-card-title>
              <v-card-text>
                <p class="subheading text-xs-center">{{ total_vouchers_count }} Vouchers</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs3>
            <v-card class="pa-1 ma-2">
              <v-card-title primary-title>
                <h3 class="title headline">Door To Door Vouchers</h3>
              </v-card-title>
              <v-card-text>
                <p class="subheading text-xs-center">{{ total_dtd_vouchers_count }} Vouchers</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs3>
            <v-card class="pa-1 ma-2">
              <v-card-title primary-title>
                <h3 class="title headline">Waybill Vouchers</h3>
              </v-card-title>
              <v-card-text>
                <p class="subheading text-xs-center">{{ total_waybill_vouchers_count }} Vouchers</p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
export default {
  middleware: ["auth"],
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "user"
    })
  },
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios, $api } = context.app;

    const data = await $api.getDashboard(
      $axios,
      jwt,
      new Date().toISOString().substr(0, 10)
    );
    if (!handleStatusInAsyncData({ status: data.status, context })) return;

    context.store.commit("title/setTitle", "Dashboard");

    // context.redirect("/pickups");
    return {
      ...data
    };
  },
  methods: {
    async onChangeDate() {
      if (!event) {
        const data = await this.$api.getDashboard(
          this.$axios,
          this.jwt,
          this.date
        );
        (this.total_pickups_count = data.total_pickups_count),
          (this.total_vouchers_count = data.total_vouchers_count),
          (this.total_dtd_vouchers_count = data.total_dtd_vouchers_count),
          (this.total_waybill_vouchers_count =
            data.total_waybill_vouchers_count);
      }
    }
  }
};
</script>
