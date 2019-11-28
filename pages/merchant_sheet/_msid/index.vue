<template>
  <div>
    <v-container fluid class="no-print">
      <v-row>
        <v-col cols="12">
          <material-cardy color="#283E4A" ref="normal" text="Parcels">
            <v-text-field
              label="Merchant"
              v-model="merchantSheet.merchant.name"
              disabled
              class="pr-5 mr-5"
              slot="searchy"
              mt-0
            ></v-text-field>
            <v-btn
              v-print
              color="green"
              small
              slot="buttons"
              class="mt-6 mr-2 ml-7"
            >Print Finance Sheet</v-btn>
            <download-excel
              :name="'Merchant Finance Sheet - ' + merchantSheet.merchantsheet_invoice + '.xls'"
              :data="vouchers"
              :fields="excelHeaders"
              small
              class="v-btn v-size--small mr-2 mt-6 green"
              slot="buttons"
            >Export</download-excel>
            <v-data-table :headers="headers" :items="vouchers" class="elevation-1">
              <template v-slot:body="{items}">
                <tbody>
                  <tr v-for="(voucher, index) in items" :key="index">
                    <td class="green--text">{{ voucher.voucher_no }}</td>
                    <!-- <td>{{ voucher.pickup.sender_associate.label }}</td> -->
                    <td class="blue--text">
                      <nuxt-link
                        target="_blank"
                        :to="`/pickups/${voucher.pickup.id}`"
                      >{{ voucher.pickup.pickup_invoice }}</nuxt-link>
                    </td>
                    <td>{{ voucher.receiver.name }}</td>
                    <td>{{ voucher.payment_type.name }}</td>
                    <td>{{ voucher.delivery_status.status }}</td>
                    <td>{{ voucher.total_delivery_amount }}</td>
                    <td>{{ voucher.total_item_price }}</td>
                    <td>{{ voucher.total_bus_fee }}</td>
                    <td>{{ voucher.receiver_zone.name }}</td>
                    <td>{{ voucher.debit_amount }}</td>
                    <td>{{ voucher.credit_amount }}</td>
                    <td>
                      <p v-if="voucher.balance<0">မာရသွန်မှရရန်</p>
                      <p v-else>မာရသွန်သိုပေးရန်</p>
                      {{ Math.abs(voucher.balance )}}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </material-cardy>
        </v-col>
      </v-row>
      <v-row mt-3>
        <v-col cols="4">
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
        </v-col>
        <v-col cols="4" offset="4" class="text-right">
          <v-layout>
            <v-flex xs5 class="body-2">
              Marathon Receivable
              <br />မာရသွန်မှရရန်
            </v-flex>
            <v-flex xs7>{{ totalDebit }} ks</v-flex>
          </v-layout>
          <v-layout mt-3>
            <v-flex xs5 class="body-2">
              Merchant Receivable
              <br />ကုန်သည်မှရရန်
            </v-flex>
            <v-flex xs7>{{ totalCredit }} ks</v-flex>
          </v-layout>
          <v-layout mt-3>
            <v-flex xs5 class="body-2">
              Total amount
              <br />စုစုပေါင်းငွေပမာဏ
            </v-flex>
            <v-flex xs7>{{totalaoc_label}} {{ Math.abs(totalAmountToCollect)}} ks</v-flex>
          </v-layout>
        </v-col>
      </v-row>
    </v-container>

    <div id="printMerchantSheet">
      <v-row mt-1>
        <v-col cols="2" class="font-weight-bold">Date:{{ merchantSheet.created_at }}</v-col>
        <v-col cols="2" class="text-xs-right">Time:{{ merchantSheet.created_time }}</v-col>

        <v-col cols="4">
          <h1 class="title font-weight-regular text-center">Marathon Myanmar</h1>
          <h1 class="title font-weight-regular text-center">Nationwide Parcel Delivery Service</h1>
        </v-col>
        <v-col cols="2">09777241334</v-col>
        <v-col cols="2">09777241335</v-col>
      </v-row>
      <v-row mt-2>
        <v-col cols="12" class="text-center">
          <span class="font-weight-medium mr-1">
            Merchant Sheet:
            {{ merchantSheet.merchantsheet_invoice }}
          </span>
          <span class="font-weight-medium mr-1">
            Merchant:
            {{ merchantSheet.merchant.name }}
          </span>
          <span class="font-weight-medium text-xs-right">
            Total Parcels:
            {{ vouchers.length }}
          </span>
        </v-col>
      </v-row>

      <v-layout row mt-2>
        <v-flex xs12>
          <v-data-table
            :headers="printHeaders"
            :items="vouchers"
            hide-default-footer
            class="elevation-1"
          >
            <template v-slot:body="{items}">
              <tbody>
                <tr v-for="(voucher, index) in items" :key="index">
                  <td>{{ index + 1 }}</td>
                  <!-- <td>{{ props.item.pickup.sender_associate.label }}</td> -->
                  <td>{{ voucher.voucher_no }}</td>
                  <td>{{ voucher.delivery_status.status }}</td>
                  <!-- <td>{{ props.item.pickup.pickup_invoice }}</td> -->
                  <!-- <td>{{ props.item.receiver.name }}</td> -->
                  <td>{{ voucher.payment_type.name }}</td>
                  <!-- <td>{{ props.item.delivery_status.status }}</td> -->
                  <td>{{ voucher.total_delivery_amount }}</td>
                  <td>{{ voucher.total_item_price }}</td>
                  <td>{{ voucher.total_bus_fee }}</td>
                  <!-- <td>{{ props.item.receiver_zone.name }}</td> -->
                  <td>{{ voucher.debit_amount }}</td>
                  <td>{{ voucher.credit_amount }}</td>
                  <td>
                    <p v-if="voucher.balance<0">မာရသွန်မှရရန်</p>
                    <p v-else>မာရသွန်သိုပေးရန်</p>
                    {{ Math.abs(voucher.balance )}}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap mt-3>
        <v-col cols="4">
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
        </v-col>
        <v-col cols="4" offset="4">
          <v-layout mt-2>
            <v-flex xs5 class="text-xs-right" offset-xs3>
              Marathon Receivable
              <br />မာရသွန်မှရရန်
            </v-flex>
            <v-flex xs4 class="text-xs-right">{{ totalDebit }} ks</v-flex>
          </v-layout>
          <v-layout mt-2>
            <v-flex xs5 class="text-xs-right" offset-xs3>
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
            <v-flex
              xs4
              class="text-xs-right"
            >{{totalaoc_label}}{{ Math.abs(totalAmountToCollect) }} ks</v-flex>
          </v-layout>
        </v-col>
      </v-layout>
    </div>
  </div>
</template>

<script>
import api from "@/assets/utilities/api";
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
import localforage from "localforage";
import helpers from "@/assets/utilities/helpers/pickupDetails";

export default {
  middleware: ["auth"],
  data() {
    return {
      headers: [
        { text: "Voucher", align: "left", value: "voucher_no" },
        // { text: "Branch", value: "pickup.sender.sender_associate.label" },
        { text: "Pickup", value: "pickup.pickup_invoice" },
        { text: "Receiver", value: "receiver.name" },
        { text: "Payment Type", value: "payment_type.name" },
        { text: "Delivery status", value: "delivery_status.status" },
        { text: "Delivery Fee", value: "total_delivery_amount" },
        { text: "Parcel Price", value: "total_item_price" },
        { text: "Bus Fee", value: "total_bus_fee" },
        { text: "Delivered City", value: "receiver_zone.name" },
        // { text: "Amount to Collect", value: "debit_amount" },
        { text: "Payable", value: "debit_amount" },
        // { text: "Amount to Send", value: "credit_amount" },
        { text: "Receivable", value: "debit_amount" },
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
        { text: "Payable", sortable: false },
        { text: "Receivable", sortable: false },
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
    const { data, status, message } = await api.get_merchantsheet_detail(
      $axios,
      jwt,
      context.route.params.msid
    );

    if (!handleStatusInAsyncData({ status, context })) return;

    let merchant = await api.getMerchantById($axios, jwt, data.merchant.id);

    if (!handleStatusInAsyncData({ status: merchant.status, context })) return;

    let vouchers = data.vouchers;

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
      `Merchant Finance Transition  ID- ${data.merchantsheet_invoice}`
    );
    return {
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
    totalaoc_label() {
      if (this.totalAmountToCollect < 0) {
        return "မာရသွန်မှရရန်";
      } else {
        return "မာရသွန်သိုပေးရန်";
      }
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
    })
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
