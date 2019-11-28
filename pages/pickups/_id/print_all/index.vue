<template>
  <div>
    <div v-for="(voucher, index) in data.vouchers" :key="index">
      <h1 class="body-1 text-xs-center">Marathon Myanmar</h1>
      <h1 class="caption text-xs-center">Nationwide Parcel Delivery Service</h1>
      <v-layout row mt-1>
        <v-flex xs6 class="print-font-size text-xs-center">09777241334</v-flex>
        <v-flex xs6 class="print-font-size text-xs-center">09777241335</v-flex>
      </v-layout>
      <h1
        class="larger-print-font-size font-weight-bold text-xs-center mt-2"
      >Voucher Receipt - {{ voucher.voucher_no }}</h1>
      <v-layout row mt-2>
        <v-flex xs6 class="print-font-size text-xs-left">Date: {{ voucher.created_at }}</v-flex>
        <v-flex xs6 class="print-font-size text-xs-right">Time: {{ voucher.created_time }}</v-flex>
      </v-layout>
      <v-divider class="mt-1"></v-divider>
      <h1 class="print-font-size font-weight-bold text-xs-center mt-2">ပေးပို့သူ</h1>
      <v-layout row>
        <v-flex
          xs12 
          class="larger-print-font-size font-weight-bold text-xs-left ml-7"
        >Name: {{ data.sender.name }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          xs12
          class="print-font-size text-xs-left"
        >Phone: {{ data.sender.phone || data.sender_associate.phones.join(', ') }}</v-flex>
      </v-layout>
      <v-divider class="mt-1"></v-divider>
      <h1 class="print-font-size font-weight-bold text-xs-center mt-2">လက်ခံသူ</h1>
      <v-layout row>
        <v-flex
          xs12
          class="larger-print-font-size font-weight-bold text-xs-left"
        >Name: {{ voucher.receiver.name }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 class="print-font-size text-xs-left">Phone: {{ voucher.receiver.phone }}</v-flex>
        <v-flex
          xs6
          class="print-font-size text-xs-right"
        >Phone2: {{ voucher.receiver.other_phone || '--Empty--' }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          xs6
          class="larger-print-font-size font-weight-bold text-xs-left"
        >City: {{ voucher.receiver_city.name }}</v-flex>
        <v-flex
          xs6
          class="larger-print-font-size font-weight-bold text-xs-right"
        >Zone: {{ voucher.receiver_zone.name || '--Empty--' }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          xs12
          class="print-font-size text-xs-left"
        >Address: {{ voucher.receiver.address || '--Empty--' }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          xs12
          class="print-font-size font-weight-bold text-xs-left mt-1"
        >Note: {{ voucher.remark || '--Empty--' }}</v-flex>
      </v-layout>
      <v-divider class="mt-1"></v-divider>
      <h1
        class="larger-print-font-size font-weight-bold text-xs-center mt-2"
      >AMOUNT TO COLLECT - {{ parseInt(voucher.amount_to_collect_receiver) }}</h1>
      <h1 class="print-font-size text-xs-center">ပို့ဆောင်ခ (၁၀) ဆကိုသာပေးလျော်ပါသည်။</h1>
      <div class="page-break"></div>
    </div>
  </div>
</template>

<script>
import { handleStatusInAsyncData } from "@/assets/utilities/helpers/common";

export default {
  middleware: ["auth"],
  layout: "clean",
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios, $api } = context.app;

    const requestId = context.params.id;
    let { status, data } = await $api.getPickupsDetails($axios, jwt, requestId);
    if (!handleStatusInAsyncData({ status, context })) return;

    return {
      data
    };
  },
  mounted: () => {
    window.print();
    setTimeout(window.close, 100);
  }
};
</script>

<style scoped>
@media print {
  @page {
    size: auto;
    margin: 1in auto;
  }
  .print-font-size {
    font-size: 12px !important;
  }
  .larger-print-font-size {
    font-size: 16px;
  }
  button,
  .v-btn,
  .no-print {
    display: none;
  }
  #printVoucher {
    display: block !important;
  }
  .page-break {
    page-break-after: always;
  }
}
</style>