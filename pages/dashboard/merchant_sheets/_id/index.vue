<template>
  <div>
    <v-container fluid class="no-print">
      <div @shortkey="nextPage" v-shortkey="['ctrl', 'arrowright']"></div>
      <div @shortkey="previousPage" v-shortkey="['ctrl', 'arrowleft']"></div>

      <v-layout row wrap mt-3>
        <v-flex xs5 offset-xs6>
          <v-layout row wrap>
            <v-flex xs5 offset-xs7>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-layout row wrap justify-end>
                    <v-btn
                      color="primary lighten-1"
                      large
                      @click="onPayMerchantSheet"
                      :disabled="closedButton || loading"
                      class="mr-0"
                    >Pay Merchant Sheet</v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-layout row wrap justify-end>
                    <v-btn v-print color="primary lighten-1" small class="mr-0">Print</v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-layout row wrap justify-end>
                    <download-excel
                      :name="'Merchant Finance Sheet - ' + merchantSheet.merchantsheet_invoice + '.xls'"
                      :data="vouchers"
                      :fields="excelHeaders"
                      class="v-btn mr-0 v-btn--small primary lighten-1"
                    >Export</download-excel>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs2 offset-xs1>
          <v-layout align-center row wrap>
            <!-- <v-spacer></v-spacer> -->
            <v-text-field
              browser-autocomplete="off"
              label="Pickup"
              name="pickup"
              @input="filterPickup"
              class="pr-4 mr-4"
            ></v-text-field>
          </v-layout>
        </v-flex>
        <v-flex xs2>
          <v-layout align-center row wrap>
            <v-spacer></v-spacer>
            <v-autocomplete
              clearable
              label="Delivery Status"
              :items="deliveryStatuses"
              item-text="status"
              item-value="status"
              name="delivery_status"
              @change="filterDeliveryStatus"
              class="pr-4 mr-4"
            ></v-autocomplete>
          </v-layout>
        </v-flex>
        <v-flex xs2>
          <v-layout align-center row wrap>
            <v-spacer></v-spacer>
            <v-text-field
              browser-autocomplete="off"
              label="Merchant"
              v-model="merchantSheet.merchant.name"
              disabled
              class="pr-5 mr-5"
            ></v-text-field>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs10 offset-xs1>
          <v-data-table
            :headers="headers"
            :loading="loading"
            :items="vouchers"
            :search="filters"
            :custom-filter="customFilter"
            :pagination.sync="pagination"
            :rows-per-page-items="[25]"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td>
                <v-btn
                  color="red darken-1"
                  flat
                  icon
                  :disabled="closedButton || loading"
                  @click="onDeleteItem(props.item)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
              <td class="blue--text">
                <nuxt-link
                  target="_blank"
                  :to="`/vouchers/details?voucherId=${props.item.id}`"
                >{{ props.item.voucher_no }}</nuxt-link>
              </td>
              <td>{{ props.item.pickup.sender_associate.label }}</td>
              <td class="blue--text">
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${props.item.pickup.id}`"
                >{{ props.item.pickup.pickup_invoice }}</nuxt-link>
              </td>
              <td>{{ props.item.receiver.name }}</td>
              <td>{{ props.item.payment_type.name }}</td>
              <td>{{ props.item.delivery_status.status }}</td>
              <td>{{ props.item.total_delivery_amount }}</td>
              <td>{{ props.item.total_item_price }}</td>
              <td>{{ props.item.total_bus_fee }}</td>
              <td>{{ props.item.receiver_zone.name }}</td>
              <td>{{ props.item.debit_amount }}</td>
              <td>{{ props.item.credit_amount }}</td>
              <td>{{ props.item.balance }}</td>
            </template>
            <template v-slot:footer>
              <tr v-show="showFooter">
                <td>
                  <span v-if="isEmptyNewVoucher">
                    <v-btn
                      color="red darken-1"
                      :disabled="closedButton || loading"
                      flat
                      icon
                      @click="onCancelItem(newVoucher)"
                    >
                      <v-icon>cancel</v-icon>
                    </v-btn>
                  </span>
                  <span v-else>
                    <v-btn
                      color="green darken-1"
                      :disabled="closedButton || loading"
                      flat
                      icon
                      @click="onAddItem(newVoucher)"
                    >
                      <v-icon>done</v-icon>
                    </v-btn>
                    <v-btn
                      color="red darken-1"
                      :disabled="closedButton"
                      flat
                      icon
                      @click="onCancelItem(newVoucher)"
                    >
                      <v-icon>cancel</v-icon>
                    </v-btn>
                  </span>
                </td>
                <td>
                  <v-text-field
                    v-if="isEmptyNewVoucher"
                    browser-autocomplete="off"
                    label="Voucher ID"
                    single-line
                    v-model="filters.voucher_invoice"
                    @keyup.enter="onSearchVoucherInvoice"
                    autofocus
                  ></v-text-field>
                  <nuxt-link
                    v-else
                    target="_blank"
                    :to="`/vouchers/details?voucherId=${newVoucher.id}`"
                  >{{ newVoucher.voucher_no }}</nuxt-link>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.pickup.sender_associate.label }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <nuxt-link
                    target="_blank"
                    v-else
                    :to="`/pickups/${newVoucher.pickup.id}`"
                  >{{ newVoucher.pickup.pickup_invoice || "--Empty--" }}</nuxt-link>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.receiver.name || "--Empty--" }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.payment_type.name || "--Empty--" }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.delivery_status.status }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.total_delivery_amount }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.total_item_price }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.total_bus_fee }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.receiver_zone.name }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.debit_amount }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.credit_amount }}</span>
                </td>
                <td>
                  <span v-if="isEmptyNewVoucher">--Empty--</span>
                  <span v-else>{{ newVoucher.balance }}</span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs11 offset-xs1 mt-1>
          <v-layout row wrap>
            <v-btn
              color="primary lighten-1"
              medium
              @click="addNewVoucher"
              class="ml-0"
              :disabled="closedButton || loading"
            >Add Voucher</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs3 offset-xs1 mt-2>
          <div v-for="(associate, index) in merchantAssociates" :key="index">
            <h1 class="title mt-3">{{ associate.label }}</h1>
            <v-layout mt-1>
              <v-flex xs5>Account Name</v-flex>
              <v-flex
                xs7
              >{{ associate.account_informations[associate.account_informations.length - 1] ? associate.account_informations[associate.account_informations.length - 1].account_name : "--Empty--"}}</v-flex>
            </v-layout>
            <v-layout mt3>
              <v-flex xs5>Account Number</v-flex>
              <v-flex
                xs7
              >{{ associate.account_informations[associate.account_informations.length - 1] ? associate.account_informations[associate.account_informations.length - 1].account_no : "--Empty--"}}</v-flex>
            </v-layout>
          </div>
        </v-flex>
        <v-flex xs3 offset-xs5>
          <v-layout>
            <v-flex xs5 class="body-2">
              <!-- Total debit
              <br />စုစုပေါင်း ကောက်ယူရန်-->
              Marathon Receivable
              <br />မာရသွန်မှရရန်
            </v-flex>
            <v-flex xs7>{{ totalDebit }} ks</v-flex>
          </v-layout>
          <v-layout mt-3>
            <v-flex xs5 class="body-2">
              <!-- Total credit
              <br />စုစုပေါင်း ပေးပို့ရန်-->
              Merchant Receivable
              <br />ကုန်သည်မှပေးရန်
            </v-flex>
            <v-flex xs7>{{ totalCredit }} ks</v-flex>
          </v-layout>
          <v-layout mt-3>
            <v-flex xs5 class="body-2">
              Total amount
              <br />စုစုပေါင်းငွေပမာဏ
            </v-flex>
            <v-flex xs7>{{ totalAmountToCollect }} ks</v-flex>
          </v-layout>
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

    <div id="printMerchantSheet">
      <v-layout row mt-1>
        <v-flex xs3>
          <v-layout row wrap>
            <v-flex xs2 class="font-weight-bold">Date:</v-flex>
            <v-flex xs4 class="text-xs-right">{{ merchantSheet.created_at }}</v-flex>
            <v-flex xs2 offset-xs1 class="font-weight-bold text-xs-left">Time:</v-flex>
            <v-flex xs3 class="text-xs-right">{{ merchantSheet.created_time }}</v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs7 text-xs-center row>
          <h1 class="title font-weight-regular">Marathon Myanmar</h1>
          <h1 class="title font-weight-regular text-xs-center">Nationwide Parcel Delivery Service</h1>
        </v-flex>
        <v-flex xs3 class="font-weight-light">
          <v-layout row>
            <span>09777241334</span>
            <span class="ml-5">09777241335</span>
          </v-layout>
        </v-flex>
      </v-layout>
      <!-- <h1 class="headline font-weight-regular text-xs-center mt-1">Marathon Myanmar</h1>
      <h1 class="title font-weight-regular text-xs-center mt-1">Nationwide Parcel Delivery Service</h1>
      <v-layout row mt-1>
        <v-flex xs12 class="text-xs-center font-weight-light">
          <span class="mr-5">09777241334</span>
          <span class="ml-5">09777241335</span>
        </v-flex>
      </v-layout>
      <h1
        class="title font-weight-bold text-xs-center mt-4"
      >Merchant Finance Sheet - {{ merchantSheet.merchantsheet_invoice }}</h1>-->
      <v-layout row wrap mt-3>
        <v-flex xs12 class="text-xs-center">
          <span>
            <span class="font-weight-medium mr-1">Merchant Sheet:</span>
            {{ merchantSheet.merchantsheet_invoice }}
          </span>
          <span class="ml-5">
            <span class="font-weight-medium mr-1">Merchant:</span>
            {{ merchantSheet.merchant.name }}
          </span>
          <span class="ml-5">
            <span class="font-weight-medium text-xs-right">Total Parcels:</span>
            {{ vouchers.length }}
          </span>
        </v-flex>
      </v-layout>

      <v-layout mt-3>
        <v-flex xs12>
          <v-data-table :headers="printHeaders" :items="vouchers" hide-actions class="elevation-1">
            <template v-slot:items="props">
              <tr>
                <td>{{ vouchers.indexOf(props.item) + 1 }}</td>
                <!-- <td>{{ props.item.pickup.sender_associate.label }}</td> -->
                <td>{{ props.item.voucher_no }}</td>
                <td>{{ props.item.delivery_status.status }}</td>
                <!-- <td>{{ props.item.pickup.pickup_invoice }}</td> -->
                <!-- <td>{{ props.item.receiver.name }}</td> -->
                <td>{{ props.item.payment_type.name }}</td>
                <!-- <td>{{ props.item.delivery_status.status }}</td> -->
                <td>{{ props.item.total_delivery_amount }}</td>
                <td>{{ props.item.total_item_price }}</td>
                <td>{{ props.item.total_bus_fee }}</td>
                <!-- <td>{{ props.item.receiver_zone.name }}</td> -->
                <td>{{ props.item.debit_amount }}</td>
                <td>{{ props.item.credit_amount }}</td>
                <td>{{ props.item.balance }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap mt-3>
        <v-flex xs3>
          <div v-for="(associate, index) in merchantAssociates" :key="index" class="mt-3">
            <span class="font-weight-bold mt-5">{{ associate.label }}</span>
            <v-layout>
              <v-flex xs5>Account Name</v-flex>
              <v-flex
                xs7
              >{{ associate.account_informations[associate.account_informations.length - 1] ? associate.account_informations[associate.account_informations.length - 1].account_name : "--Empty--"}}</v-flex>
            </v-layout>
            <v-layout mt3>
              <v-flex xs5>Account Number</v-flex>
              <v-flex
                xs7
              >{{ associate.account_informations[associate.account_informations.length - 1] ? associate.account_informations[associate.account_informations.length - 1].account_no : "--Empty--"}}</v-flex>
            </v-layout>
          </div>
        </v-flex>
        <v-flex xs4 offset-xs5>
          <v-layout mt-2>
            <v-flex xs5 class="text-xs-right" offset-xs3>
              <!-- Total debit
              <br />စုစုပေါင်း ကောက်ယူရန်-->
              Marathon Receivable
              <br />မာရသွန်မှရရန်
            </v-flex>
            <v-flex xs4 class="text-xs-right">{{ totalDebit }} ks</v-flex>
          </v-layout>
          <v-layout mt-2>
            <v-flex xs5 class="text-xs-right" offset-xs3>
              <!-- Total credit
              <br />စုစုပေါင်း ပေးပို့ရန်-->
              Merchant Receivable
              <br />ကုန်သည်မှရရန်
            </v-flex>
            <v-flex xs4 class="text-xs-right">{{ totalCredit }} ks</v-flex>
          </v-layout>
          <v-layout mt-2>
            <v-flex xs5 class="body-2 text-xs-right" offset-xs3>
              Total amount
              <br />စုစုပေါင်းငွေပမာဏ
            </v-flex>
            <v-flex xs4 class="text-xs-right">{{ totalAmountToCollect }} ks</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import api from "@/assets/utilities/api";
import _ from "lodash";
import validator from "validator";
import AppBack from "@/components/App/Back.vue";
import { mapGetters, mapActions } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
import localforage from "localforage";
import helpers from "@/assets/utilities/helpers/pickupDetails";
import AppDeleteConfirmation from "@/components/App/DeleteConfirmation";

export default {
  middleware: ["auth"],
  // layout: "clean",
  components: {
    AppBack,
    AppDeleteConfirmation
  },
  data() {
    return {
      editMerchantSheet: {
        id: this.$route.params.id,
        vouchers: []
      },
      filters: {
        search: "",
        call_status: "",
        delivery_status: "",
        pickup_invoice: "",
        voucher_invoice: ""
      },
      showFooter: false,
      loading: false,
      newVoucher: {},
      snack: false,
      snackColor: "",
      snackText: "",
      snackbar: false,
      snackbarMessage: "",
      isDeleteDialogOpen: false,
      pagination: {
        sortBy: "id",
        descending: true
      },
      selectedById: 0,
      rowState: null,
      headers: [
        { text: "Actions", value: "name", sortable: false, width: "50" },
        { text: "Voucher", align: "left", value: "voucher_no" },
        { text: "Branch", value: "pickup.sender.sender_associate.label" },
        { text: "Pickup", value: "pickup.pickup_invoice" },
        { text: "Receiver", value: "receiver.name" },
        { text: "Payment Type", value: "payment_type.name" },
        { text: "Delivery status", value: "delivery_status.status" },
        { text: "Delivery Fee", value: "total_delivery_amount" },
        { text: "Parcel Price", value: "total_item_price" },
        { text: "Bus Fee", value: "total_bus_fee" },
        { text: "Delivered City", value: "receiver_zone.name" },
        // { text: "Amount to Collect", value: "debit_amount" },
        { text: "Receivable", value: "debit_amount" },
        // { text: "Amount to Send", value: "credit_amount" },
        { text: "Payable", value: "debit_amount" },
        { text: "Balance", value: "balance" }
      ],
      printHeaders: [
        { text: "#", sortable: false },
        { text: "Voucher", sortable: false },
        { text: "Status", sortable: false },
        // { text: "Pickup", sortable: false },
        // { text: "Receiver", sortable: false },
        { text: "Payment Type", sortable: false },
        // { text: "Delivery status", sortable: false },
        { text: "Delivery Fee", sortable: false },
        { text: "Parcel Price", sortable: false },
        { text: "Bus Fee", sortable: false },
        // { text: "Delivered City", sortable: false },
        { text: "Receivable", sortable: false },
        { text: "Payable", sortable: false },
        { text: "Balance", sortable: false }
      ],

      excelHeaders: {
        "Pickup Date": "pickup.created_at",
        "Pickup no": "pickup.pickup_invoice",
        "Voucher No": "voucher_no",

        Branch: {
          field: "pickup",
          callback: pickup => pickup.sender_associate.label
        },
        "Sender Name": "pickup.sender.name",
        "Sender Phone": {
          field: "pickup",
          callback: pickup =>
            pickup.sender_type == "Customer"
              ? pickup.sender.phone
              : pickup.sender_associate.phones.join(", ")
        },
        "Receiver Name": "receiver.name",
        "Receiver Phone": "receiver.phone",
        "Des City": "receiver_city.name",
        Zone: "receiver_zone.name",
        "Receiver Address": "receiver.address",
        "Bus Station": "sender_bus_station",
        Gate: "sender_gate",
        "Bus Fee": "total_bus_fee",
        "Delivery Fee": "total_delivery_amount",
        "Payment Type": "payment_type.name",
        "ATC Sender": "amount_to_collect_sender",
        "ATC Receiver": "amount_to_collect_receiver",
        Receiable: "debit_amount",
        Payable: "credit_amount",
        "Net Amount": "balance",
        "Cash Transfer Status": "merchant_payment_status",
        "Cash Transfer Date": "merchant_payment_date"
      }
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
    let vouchers = [];
    let vouchers_api = [];

    const { data, status, message } = await api.getMerchantSheetById(
      $axios,
      jwt,
      context.route.params.id
    );

    if (!handleStatusInAsyncData({ status, context })) return;

    let merchant = await api.getMerchantById($axios, jwt, data.merchant.id);

    if (!handleStatusInAsyncData({ status: merchant.status, context })) return;

    data.vouchers.forEach(voucher => {
      var voucher = api.getVouchersDetailsByMerchantSheet(
        $axios,
        jwt,
        voucher.id
      );
      vouchers_api.push(voucher);
    });

    (await Promise.all(vouchers_api)).forEach(voucher =>
      vouchers.push(voucher.data)
    );

    vouchers.forEach(voucher => {
      voucher.receiver_zone = voucher.receiver_zone || voucher.receiver_city;
      voucher.sender_bus_station =
        voucher.bus_station == true ? voucher.sender_bus_station.name : "";
      voucher.sender_gate =
        voucher.bus_station == true ? voucher.sender_gate.name : "";
      voucher.merchant_payment_status =
        data.is_paid == true ? "paid" : "unpaid";
      voucher.merchant_payment_date =
        data.is_paid == true ? data.updated_at : "";
    });
    context.store.commit(
      "title/setTitle",
      `Merchant Finance Confirmation - ${data.merchantsheet_invoice} - Finance KA or Merchant KA`
    );
    return {
      callStatuses: [...callStatuses],
      storeStatuses: [...storeStatuses],
      deliveryStatuses: [...deliveryStatuses],
      merchantSheet: { ...data },
      vouchers,
      merchantAssociates: merchant.data.branches
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "user"
    }),
    filteredStaffs() {
      return this.staffs.filter(data => data.zone.id == this.zone);
    },
    selectedStaff() {
      return this.staffs.find(data => data.id == this.staff);
    },
    closedButton() {
      // if (this.merchantSheet.closed == 0 || this.merchantSheet.closed == 1) return true;
      if (this.merchantSheet.is_paid) return true;
      return false;
    },
    isEmptyNewVoucher() {
      return _.isEmpty(this.newVoucher);
    },
    totalAmountToCollect() {
      let totalAmount = 0;
      this.vouchers.forEach(voucher => {
        totalAmount += parseInt(voucher.balance);
      });
      return totalAmount;
    },
    totalDebit() {
      let totalDebit = 0;
      this.vouchers.forEach(voucher => {
        totalDebit += parseInt(voucher.debit_amount);
      });
      return totalDebit;
    },
    totalCredit() {
      let totalCredit = 0;
      this.vouchers.forEach(voucher => {
        totalCredit += parseInt(voucher.credit_amount);
      });
      return totalCredit;
    }
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    async onPayMerchantSheet() {
      this.loading = true;
      let vouchersId = [];
      this.vouchers.forEach(voucher => vouchersId.push(voucher.id));

      const { data, message, status } = (await api.paidMerchantSheet(
        this,
        vouchersId
      )).data;
      let successMessage = "Merchant Sheet is Successfully paid.";

      if (status === 1) {
        this.$router.push("/dashboard/merchant_sheets");
      }
      handleStatus({ status, message, that: this, successMessage });
      this.loading = false;
    },
    addNewVoucher() {
      this.showFooter = true;
    },
    async onSearchVoucherInvoice() {
      this.loading = true;
      const {
        data,
        status,
        message,
        meta,
        links
      } = await this.$api.getVouchers(
        this.$axios,
        this.jwt,
        `${this.$api.VOUCHER_URL}?voucher_invoice=${this.filters.voucher_invoice}`
      );
      if (status == 1) {
        let message = [];
        this.newVoucher = data[0];
        this.loading = false;
        message = this.vouchers.find(
          voucher => voucher.id == this.newVoucher.id
        )
          ? "Please add unique id for this DeliSheet"
          : this.newVoucher.assign_sheet == null
          ? "Voucher is not assigned to any sheet!"
          : "";
        if (message) {
          this.newVoucher = {};
          return handleStatus({
            status: 2,
            message: message,
            that: this,
            successMessage: "Success"
          });
        }
      }
    },
    async onAddItem(newVoucher) {
      this.loading = true;
      const successMessage = "The voucher has been added successfully";
      const { data, status, message } = (await api.addMerchantSheetVoucher(
        this,
        newVoucher
      )).data;
      if (status == 1) {
        this.vouchers.push(this.newVoucher);
      }
      handleStatus({ status, message, that: this, successMessage });
      this.filters.voucher_invoice = "";
      this.showFooter = false;
      this.newVoucher = {};
      this.loading = false;
    },
    onCancelItem(newVoucher) {
      this.filters.voucher_invoice = "";
      this.newVoucher = {};
      this.showFooter = false;
    },
    closeDelete() {
      this.closeDeleteDialog(this);
    },
    onDeleteItem(item) {
      this.onDelete(this, item);
    },
    async confirmDelete() {
      this.loading = true;
      const successMessage = "The voucher has been removed successfully";
      const { data, status, message } = (await api.removeMerchantSheetVoucher(
        this,
        this.deletingId
      )).data;
      if (status === 1) {
        const foundIndex = this.vouchers.findIndex(
          voucher => voucher.id === this.deletingId
        );
        this.vouchers.splice(foundIndex, 1);
      }
      this.handleStatus({ status, message, that: this, successMessage });
      this.closeDeleteDialog(this);
      this.loading = false;
    },
    customFilter(items, filters, filter, headers) {
      const cf = new this.$MultiFilters(items, filters, filter, headers);

      cf.registerFilter("search", function(searchWord, items) {
        if (searchWord.trim() === "") return items;

        return items.filter(item => {
          return (
            item.pickup.sender.name
              .toLowerCase()
              .includes(searchWord.toLowerCase()) ||
            item.receiver.name.toLowerCase().includes(searchWord.toLowerCase())
          );
        }, searchWord);
      });

      cf.registerFilter("call_status", function(call_status, items) {
        if (call_status.trim() === "") return items;

        return items.filter(item => {
          return (
            item.call_status.status.toLowerCase() === call_status.toLowerCase()
          );
        }, call_status);
      });

      cf.registerFilter("delivery_status", function(delivery_status, items) {
        if (delivery_status.trim() === "") return items;

        return items.filter(item => {
          return (
            item.delivery_status.status.toLowerCase() ===
            delivery_status.toLowerCase()
          );
        }, delivery_status);
      });

      cf.registerFilter("pickup_invoice", function(pickup_invoice, items) {
        if (pickup_invoice.trim() === "") return items;

        return items.filter(item => {
          let pickup_match = new RegExp(pickup_invoice, "g");
          return item.pickup.pickup_invoice.match(pickup_match);
        }, pickup_invoice);
      });
      return cf.runFilters();
    },

    filterSearch(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        search: val
      });
    },
    filterCallStatus(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        call_status: val
      });
    },
    filterDeliveryStatus(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        delivery_status: val
      });
    },
    filterPickup(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        pickup_invoice: val
      });
    },
    nextPage() {
      document.querySelector('[aria-label="Next page"]').click();
    },
    previousPage() {
      document.querySelector('[aria-label="Previous page"]').click();
    },
    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
      this.delivery_status_show = true;
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      this.delivery_status_show = true;
    }
  },
  created() {},
  mounted() {
    this.setNavigationShow(true);
    this.setNavigationUrl("/dashboard/merchant_sheets");
  }
};
</script>

<style scoped>
#printMerchantSheet {
  display: none;
}
@media print {
  button,
  .v-btn,
  .no-print {
    display: none;
  }
  #printMerchantSheet {
    display: block !important;
  }
}
</style>
