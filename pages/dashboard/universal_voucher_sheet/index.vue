<template>
  <v-container fluid>
    <div @shortkey="nextPage" v-shortkey="['ctrl', 'arrowright']"></div>
    <div @shortkey="previousPage" v-shortkey="['ctrl', 'arrowleft']"></div>
    <div @shortkey="termChangeEnter" v-shortkey="['enter']"></div>

    <v-layout row wrap mt-3>
      <v-flex xs2 mr-2 offset-xs1>
        <v-text-field
          browser-autocomplete="off"
          clearable
          label="Voucher ID"
          single-line
          hide-details
          v-model="filters.voucher_invoice"
          class="pr-2 mr-3"
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-layout align-center row wrap>
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="filters.date"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            @input="onChangeDate"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                clearable
                browser-autocomplete="off"
                v-model="filters.date"
                label="Date"
                prepend-icon="event"
                readonly
                v-on="on"
                class="pr-1 mr-1"
              ></v-text-field>
            </template>
            <v-date-picker v-model="filters.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dateMenu.save(filters.date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-layout>
      </v-flex>
      <v-flex xs2 mr-2>
        <v-layout align-center row wrap>
          <v-spacer></v-spacer>
          <v-autocomplete
            clearable
            label="Receiver City"
            :items="cities"
            item-text="name"
            item-value="id"
            name="city"
            v-model="filters.receiver_city"
            class="pr-1 mr-1"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
      <v-flex xs2 mr-2>
        <v-layout align-center row wrap>
          <v-spacer></v-spacer>
          <v-autocomplete
            clearable
            label="Receiver Zone"
            :items="filterZones"
            item-text="name"
            item-value="id"
            name="zone"
            no-data-text="Select Receiver City First"
            v-model="filters.receiver_zone"
            class="pr-1 mr-1"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
      <v-flex xs2 mr-2>
        <v-text-field
          clearable
          browser-autocomplete="off"
          label="Sender Name"
          v-model="filters.sender"
          single-line
          hide-details
          class="pr-2 mr-3"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-3>
      <v-flex xs2 offset-xs1>
        <v-text-field
          clearable
          browser-autocomplete="off"
          label="Receiver Name"
          v-model="filters.receiver_name"
          single-line
          hide-details
          class="pr-2 mr-3"
        ></v-text-field>
      </v-flex>
      <v-flex xs2 mr-2>
        <v-text-field
          clearable
          browser-autocomplete="off"
          label="Receiver Phone"
          v-model="filters.receiver_phone"
          single-line
          hide-details
          class="pr-2 mr-3"
        ></v-text-field>
      </v-flex>
      <v-flex xs2 mr-2>
        <v-layout align-center row wrap>
          <v-spacer></v-spacer>
          <v-autocomplete
            clearable
            label="Calling Status"
            :items="callStatuses"
            item-text="status"
            item-value="status"
            name="call_status"
            v-model="filters.call_status"
            class="pr-1 mr-1"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
      <v-flex xs2 mr-2>
        <v-layout align-center row wrap>
          <v-spacer></v-spacer>
          <v-autocomplete
            clearable
            label="Delivery Status"
            :items="deliveryStatuses"
            item-text="status"
            item-value="status"
            name="delivery_status"
            v-model="filters.delivery_status"
            class="pr-1 mr-1"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
      <v-flex xs2 text-xs-right>
        <v-btn color="primary lighten-1" large @click="termChange" :disabled="loading">Search</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs11 offset-xs1>
        <v-layout row wrap>
          <download-excel
            name="Universal_Vouchers.xls"
            :data="vouchers"
            :fields="excelHeaders"
            class="v-btn ml-0 primary lighten-1"
          >Export</download-excel>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-data-table
          :headers="headers"
          :items="vouchers"
          :pagination.sync="pagination"
          :total-items="pagination.totalItems"
          :rows-per-page="pagination.rowsPerPage"
          :rows-per-page-items="pagination.rowsPerPageItems"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>
              <v-btn
                color="grey darken-1"
                flat
                icon
                target="_blank"
                :href="`/vouchers/print?voucher_no=${props.item.voucher_no}&created_at=${props.item.created_at}&created_time=${props.item.created_time}&sender_name=${props.item.pickup.sender.name}&sender_phone=${props.item.pickup.sender.phone || props.item.pickup.sender_associate.phones.join(', ')}
                    &receiver_name=${props.item.receiver.name}&receiver_phone=${props.item.receiver.phone}&receiver_other_phone=${props.item.receiver.other_phone || '--Empty--'}&receiver_city_name=${props.item.receiver_city.name}&receiver_zone_name=${ props.item.receiver_zone ? props.item.receiver_zone.name : '--Empty--' }&receiver_address=${props.item.receiver.address || '--Empty--'}&remark=${props.item.remark || '--Empty--'}&amount_to_collect_receiver=${props.item.amount_to_collect_receiver}`"
              >
                <v-icon>print</v-icon>
              </v-btn>
              <v-btn color="red darken-1" flat icon @click="onDeleteItem(props.item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
            <td class="blue--text">
              <nuxt-link
                target="_blank"
                :to="`/vouchers/details?voucherId=${props.item.id}`"
              >{{ props.item.voucher_no }}</nuxt-link>
            </td>
            <td>{{ props.item.created_at }}</td>
            <td>{{ props.item.remark }}</td>
            <td>
              {{
              props.item.receiver_gate
              ? props.item.receiver_gate.name
              : typeof props.item.receiver_city === "object"
              ? props.item.receiver_city.name
              : ""
              }}
            </td>
            <td>
              {{
              props.item.receiver_bus_station
              ? props.item.receiver_bus_station.name
              : typeof props.item.receiver_zone === "object"
              ? props.item.receiver_zone.name
              : ""
              }}
            </td>
            <td>{{ props.item.pickup ? props.item.pickup.sender.name : "--Empty--" }}</td>
            <td>{{ props.item.receiver.name }}</td>
            <td>{{ props.item.receiver.phone }}</td>
            <td>{{ props.item.call_status.status }}</td>
            <td>{{ props.item.delivery_status.status }}</td>
            <!-- <td>{{ props.item.payment_status.status }}</td> -->
            <td>{{ props.item.amount_to_collect_sender }}</td>
            <td>{{ props.item.amount_to_collect_receiver }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <AppDeleteConfirmation
      :isDelConfirmationOpen="isDeleteDialogOpen"
      @confirmDelete="confirmDelete"
      @closeDeleteDialog="closeDelete"
    ></AppDeleteConfirmation>
    <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
      {{ snackbarMessage }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import _ from "lodash";
import api from "@/assets/utilities/api";
import { mapGetters, mapActions } from "vuex";
import { handleStatusInAsyncData } from "@/assets/utilities/helpers/common";
import localforage from "localforage";
import AppDeleteConfirmation from "@/components/App/DeleteConfirmation";

export default {
  middleware: ["auth"],
  validate({ params }) {
    return false;
  },
  components: { AppDeleteConfirmation },
  data() {
    return {
      filters: {
        date: "",
        voucher_invoice: "",
        receiver_city: "",
        receiver_zone: "",
        sender: "",
        receiver: "",
        call_status: "",
        delivery_status: "",
        sender_gate: ""
      },
      filterZones: [],
      loading: true,
      dateMenu: false,
      snackbar: false,
      snackbarMessage: "",
      vouchers: [],
      isDeleteDialogOpen: false,
      pagination: {
        descending: true,
        page: 1,
        rowsPerPage: null,
        sortBy: "",
        totalItems: 0,
        rowsPerPageItems: [25],
        prev: null,
        next: null,
        current_page: null
      },
      headers: [
        { text: "Actions", align: "center", sortable: false },
        { text: "Voucher", align: "left", value: "voucher_invoice" },
        { text: "Date", value: "created_at", sortable: false },
        { text: "Note", value: "remark", sortable: false },
        { text: "City", value: "receiver_city.name", sortable: false },
        { text: "Zone", value: "receiver_zone.name", sortable: false },
        { text: "Sender", value: "pickup.sender.name", sortable: false },
        { text: "Receiver", value: "receiver.name", sortable: false },
        { text: "Receiver Phone", value: "receiver.phone", sortable: false },
        {
          text: "Calling status",
          value: "call_status.status",
          sortable: false
        },
        {
          text: "Delivery status",
          value: "delivery_status.status",
          sortable: false
        },
        // { text: "Payment status", value: "payment_status.status", sortable: false },
        {
          text: "ATC Sender",
          value: "amount_to_collect_sender",
          sortable: false
        },
        {
          text: "ATC Receiver",
          value: "amount_to_collect_receiver",
          sortable: false
        }
      ],
      excelHeaders: {
        "Voucher No ": "voucher_no",
        Date: "created_at",
        Note: "remark",
        City: {
          callback: voucher =>
            voucher.receiver_gate
              ? voucher.receiver_gate.name
              : typeof voucher.receiver_city === "object"
              ? voucher.receiver_city.name
              : ""
        },
        Zone: {
          callback: voucher =>
            voucher.receiver_bus_station
              ? voucher.receiver_bus_station.name
              : typeof voucher.receiver_zone === "object"
              ? voucher.receiver_zone.name
              : ""
        },
        Sender: "pickup.sender.name",
        Receiver: "receiver.name",
        "Receiver Phone": "receiver.phone",
        "Calling status": "call_status.status",
        "Delivery status": "delivery_status.status",
        "ATC Sender": "amount_to_collect_sender",
        "ATC Receiver": "amount_to_collect_receiver"
      }
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios } = context.app;

    let responses = await Promise.all([
      localforage.getItem("stored:callStatuses"),
      localforage.getItem("stored:storeStatuses"),
      localforage.getItem("stored:deliveryStatuses"),
      localforage.getItem("stored:metas"),
      localforage.getItem("stored:zones"),
      localforage.getItem("stored:cities")
    ]);

    let callStatuses = responses[0];
    let storeStatuses = responses[1];
    let deliveryStatuses = responses[2];
    let metas = responses[3];
    let zones = responses[4];
    let cities = responses[5];
    let branch = metas.find(meta => meta.key === "branch").value;
    // zones = zones.filter(zone => zone.city.id == branch);

    context.store.commit("title/setTitle", "Universal Voucher Sheet (UVs)");
    return {
      callStatuses,
      storeStatuses,
      deliveryStatuses,
      zones,
      cities
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
    termChange() {
      let query = `?voucher_invoice=${this.filters.voucher_invoice ||
        ""}&date=${this.filters.date || ""}&receiver_city=
                  ${this.filters.receiver_city || ""}&receiver_zone=${this
        .filters.receiver_zone || ""}&sender=
                  ${this.filters.sender || ""}&receiver_name=${this.filters
        .receiver_name || ""}&receiver_phone=${this.filters.receiver_phone ||
        ""}&call_status=
                  ${this.filters.call_status || ""}&delivery_status=${this
        .filters.delivery_status || ""}&sender_gate=${this.filters
        .sender_gate || ""}`;
      this.getDataFromApi(api.VOUCHER_URL + query);
    },
    termChangeEnter() {
      // if (_.values(this.filters).every(_.isEmpty)) return;
      if (
        _.values(this.filters).every(
          value => value == "" || value == undefined || value == null
        )
      )
        return;
      this.termChange();
    },
    async getDataFromApi(url) {
      this.loading = true;
      const { data, status, message, meta, links } = await api.getVouchers(
        this.$axios,
        this.jwt,
        url
      );
      if (status !== 1) {
        await localforage.clear();
        this.$router.push("/login");
        return false;
      }

      setTimeout(() => {
        this.vouchers = data;
        this.setPaginationData(this, links, meta);
      }, 700);
    },
    onChangeDate(event) {
      if (!event) {
        // this.termChange();
      }
    },
    nextPage() {
      document.querySelector('[aria-label="Next page"]').click();
    },
    previousPage() {
      document.querySelector('[aria-label="Previous page"]').click();
    },
    closeDelete() {
      this.closeDeleteDialog(this);
    },
    onDeleteItem(item) {
      this.onDelete(this, item);
      this.isDeleteDialogOpen = true;
    },
    async confirmDelete() {
      const successMessage = "The voucher has been deleted successfully";
      const { data, status, message } = (await api.deleteVouchers(this)).data;
      if (status === 1) {
        const foundIndex = this.vouchers.findIndex(
          voucher => voucher.id === this.deletingId
        );
        this.vouchers.splice(foundIndex, 1);
      }
      this.handleStatus({ status, message, that: this, successMessage });
      this.closeDeleteDialog(this);
    }
  },
  watch: {
    pagination: {
      handler(event) {
        this.paginationDataTableVouchers(this, api.VOUCHER_URL, event);
      }
    },
    filters: {
      handler(val) {
        if (this.filters.receiver_city)
          this.filterZones = this.zones.filter(
            zone => zone.city.id == this.filters.receiver_city
          );
        else {
          this.filterZones = [];
          this.filters.receiver_zone = "";
        }
      },
      deep: true
    }
    // deep: true
  },
  created() {},
  mounted() {
    this.setNavigationShow(false);
    this.setNavigationUrl("");
  }
};
</script>
