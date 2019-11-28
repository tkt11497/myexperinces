<template>
  <v-container fluid>
    <div @shortkey="nextPage" v-shortkey="['ctrl', 'arrowright']"></div>
    <div @shortkey="previousPage" v-shortkey="['ctrl', 'arrowleft']"></div>

    <v-layout row wrap mt-3>
      <v-flex xs2 offset-xs1>
        <v-layout align-center row wrap>
          <h6 class="title">Date</h6>
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
      <v-flex xs3 offset-xs5>
        <v-text-field
          autocomplete="off"
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-data-table
          :headers="headers"
          :items="pickups"
          :search="search"
          :loading="loading"
          :pagination.sync="pagination"
          :rows-per-page-items="[25]"
          class="elevation-1"
        >
          <template v-slot:body="{items}">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td class="blue--text">
                  <nuxt-link target="_blank" :to="`/pickups/${item.id}`">{{ item.pickup_invoice }}</nuxt-link>
                </td>
                <td>{{ item.note || '--Empty--' }}</td>
                <td>{{ item.sender_type }}</td>
                <td>{{ item.sender.name }}</td>
                <td>
                  {{
                  item.sender_type == "Customer"
                  ? item.sender.phone
                  : item.sender_associate.phones.join(", ")
                  }}
                </td>
                <td>
                  {{
                  item.sender_type == "Customer"
                  ? item.sender.city.name
                  : item.sender_associate.city.name
                  }}
                </td>
                <td>
                  {{
                  item.sender_type == "Customer"
                  ? typeof item.sender.zone === "object"
                  ? item.sender.zone.name
                  : ""
                  : typeof item.sender_associate.zone === "object"
                  ? item.sender_associate.zone.name
                  : ""
                  }}
                </td>
                <td>
                  {{
                  item.sender_type == "Customer"
                  ? item.sender.address
                  : item.sender_associate.address
                  }}
                </td>
                <td>{{ item.voucher_count }}</td>
                <td>{{ item.opened_by ? props.item.opened_by.name : '' }}</td>
                <td>{{ item.take_pickup_fee == 1 ? "Yes" : "No" }}</td>
                <td>{{ item.pickup_fee }}</td>
                <td>{{ item.total_prepaid_amount }}</td>
                <td>{{ item.created_at }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
      {{ snackbarMessage }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from "@/assets/utilities/api";
import { mapGetters, mapActions } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
import localforage from "localforage";

export default {
  middleware: ["auth"],

  components: {},
  data() {
    return {
      search: "",
      loading: false,
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false,
      snackbar: false,
      snackbarMessage: "",
      pagination: {
        sortBy: "id",
        descending: true
      },
      headers: [
        { text: "Pickup", value: "pickup_invoice" },
        { text: "Note", value: "note" },
        { text: "Sender Type", value: "sender_type" },
        { text: "Sender Name", value: "sender.name" },
        { text: "Sender Phone", value: "sender.phone" },
        { text: "City", value: "sender.city.name" },
        { text: "Zone", value: "sender.zone.name" },
        { text: "Address", value: "sender.address" },
        { text: "Vouchers Qty", value: "qty" },
        { text: "Pickup By", value: "opened_by.name" },
        { text: "Take Pickup Fee", value: "take_pickup_fee" },
        { text: "Pickup Fee", value: "pickup_fee" },
        { text: "Total Prepaid Amount", value: "total_prepaid_amount" },
        { text: "Date", value: "created_at" }
      ]
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios } = context.app;

    let responses = await Promise.all([
      localforage.getItem("stored:callStatuses"),
      localforage.getItem("stored:storeStatuses"),
      localforage.getItem("stored:deliveryStatuses")
    ]);

    let callStatuses = responses[0];
    let storeStatuses = responses[1];
    let deliveryStatuses = responses[2];

    const { data, status, message } = await api.getAllPickups(
      $axios,
      jwt,
      new Date().toISOString().substr(0, 10)
    );

    data.forEach(data => {
      data.sender.zone = data.sender.zone || "";
    });

    if (!handleStatusInAsyncData({ status, context })) return;
    context.store.commit("title/setTitle", "Universal Pickup Sheet (UVs)");
    return {
      callStatuses: [...callStatuses],
      storeStatuses: [...storeStatuses],
      deliveryStatuses: [...deliveryStatuses],
      pickups: [...data]
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "user"
    })
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    async onChangePickups(event) {
      this.loading = true;
      const successMessage =
        "Successfully loaded pickups for corresponding Zones.";
      const { data, status, message } = await api.getAllPickups(
        this.$axios,
        this.jwt,
        this.date
      );

      data.forEach(data => {
        data.sender.zone = data.sender.zone || "";
      });

      this.pickups = [...data];
      setTimeout(() => (this.loading = false), 700);
      // handleStatus({ status, message, that: this, successMessage });
    },
    onChangeDate(event) {
      if (!event) {
        this.onChangePickups();
      }
    },
    nextPage() {
      document.querySelector('[aria-label="Next page"]').click();
    },
    previousPage() {
      document.querySelector('[aria-label="Previous page"]').click();
    }
  },
  created() {},
  mounted() {
    this.setNavigationShow(false);
    this.setNavigationUrl("");
  }
};
</script>
