<template>
  <div id="printVoucher">
    <h1 class="body-1 text-xs-center">Marathon Myanmar</h1>
    <h1 class="caption text-xs-center">Nationwide Parcel Delivery Service</h1>
    <v-layout row mt-1>
      <v-flex xs6 class="print-font-size text-xs-center">09777241334</v-flex>
      <v-flex xs6 class="print-font-size text-xs-center">09777241335</v-flex>
    </v-layout>
    <h1
      class="larger-print-font-size font-weight-bold text-xs-center mt-2"
    >Voucher Receipt - {{ this.$route.query.voucher_no }}</h1>
    <v-layout row mt-2>
      <v-flex xs6 class="print-font-size text-xs-left">Date: {{ this.$route.query.created_at }}</v-flex>
      <v-flex xs6 class="print-font-size text-xs-right">Time: {{ this.$route.query.created_time }}</v-flex>
    </v-layout>
    <v-divider class="mt-1"></v-divider>
    <h1 class="print-font-size font-weight-bold text-xs-center mt-2">ပေးပို့သူ</h1>
    <v-layout row>
      <v-flex
        xs12
        class="larger-print-font-size font-weight-bold text-xs-left"
      >Name: {{ this.$route.query.sender_name }}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 class="print-font-size text-xs-left">Phone: {{ this.$route.query.sender_phone }}</v-flex>
    </v-layout>
    <v-divider class="mt-1"></v-divider>
    <h1 class="print-font-size font-weight-bold text-xs-center mt-2">လက်ခံသူ</h1>
    <v-layout row>
      <v-flex
        xs12
        class="larger-print-font-size font-weight-bold text-xs-left"
      >Name: {{ this.$route.query.receiver_name }}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 class="print-font-size text-xs-left">Phone: {{ this.$route.query.receiver_phone }}</v-flex>
      <v-flex
        xs6
        class="print-font-size text-xs-right"
      >Phone2: {{ this.$route.query.receiver_other_phone }}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs6
        class="larger-print-font-size font-weight-bold text-xs-left"
      >City: {{ this.$route.query.receiver_city_name }}</v-flex>
      <v-flex
        xs6
        class="larger-print-font-size font-weight-bold text-xs-right"
      >Zone: {{ this.$route.query.receiver_zone_name }}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        class="print-font-size text-xs-left"
      >Address: {{ this.$route.query.receiver_address }}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        class="print-font-size font-weight-bold text-xs-left mt-1"
      >Note: {{ this.$route.query.remark }}</v-flex>
    </v-layout>
    <v-divider class="mt-1"></v-divider>
    <h1
      class="larger-print-font-size font-weight-bold text-xs-center mt-2"
    >AMOUNT TO COLLECT - {{ parseInt(this.$route.query.amount_to_collect_receiver) }}</h1>
    <h1 class="print-font-size text-xs-center">ပို့ဆောင်ခ (၁၀) ဆကိုသာပေးလျော်ပါသည်။</h1>
  </div>
</template>

<script>
export default {
  middleware: ["auth"],
  layout: "clean",
  mounted: () => {
    window.print();
    setTimeout(window.close, 100);
  }
};
</script>

<style scoped>
#printVoucher {
  display: none;
}
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
}
</style>