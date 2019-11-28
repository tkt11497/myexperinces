<template>
  <v-container id="printVoucher">
    <v-row>
      <v-col cols="12">
        <h1 class="body-1 text-center">Marathon Myanmar</h1>
        <h1 class="caption text-xs-center">Nationwide Parcel Delivery Service</h1>
        <v-row no-gutters>
          <v-col cols="6" class="print-font-size text-center">09777241334</v-col>
          <v-col cols="6" class="print-font-size text-center">09777241335</v-col>
        </v-row>
      </v-col>
    </v-row>

    <h1
      class="larger-print-font-size font-weight-bold text-xs-center mt-2"
    >Voucher Receipt - {{ this.$route.query.voucher_no }}</h1>
    <v-layout row mt-2 no-gutters>
      <v-flex xs6 class="print-font-size text-xs-left">Date: {{ this.$route.query.created_at }}</v-flex>
      <v-flex xs6 class="print-font-size text-xs-right">Time: {{ this.$route.query.created_time }}</v-flex>
    </v-layout>
    <v-divider class="mt-1"></v-divider>
    <v-row no-gutters>
      <v-col cols="12">
        <h1 class="print-font-size font-weight-bold text-center">ပေးပို့သူ</h1>
      </v-col>
    </v-row>
    <v-layout row no-gutters>
      <v-flex
        xs12
        class="larger-print-font-size font-weight-bold text-xs-left"
      >Name: {{ this.$route.query.sender_name }}</v-flex>
    </v-layout>
    <v-layout row no-gutters>
      <v-flex xs12 class="print-font-size text-xs-left">Phone: {{ this.$route.query.sender_phone }}</v-flex>
    </v-layout>
    <v-divider class="mt-1"></v-divider>
    <v-row no-gutters>
      <v-col cols="12">
        <h1 class="print-font-size font-weight-bold text-center">လက်ခံသူ</h1>
      </v-col>
    </v-row>
    <v-layout row no-gutters>
      <v-flex
        xs12
        class="larger-print-font-size font-weight-bold text-xs-left"
      >Name: {{ this.$route.query.receiver_name }}</v-flex>
    </v-layout>
    <v-layout row no-gutters>
      <v-flex xs6 class="print-font-size text-xs-left">Phone: {{ this.$route.query.receiver_phone }}</v-flex>
      <v-flex
        xs6
        class="print-font-size text-xs-right"
      >Phone2: {{ this.$route.query.receiver_other_phone }}</v-flex>
    </v-layout>
    <v-layout row no-gutters>
      <v-flex
        xs6
        class="larger-print-font-size font-weight-bold text-xs-left"
      >City: {{ this.$route.query.receiver_city_name }}</v-flex>
      <v-flex
        xs6
        class="larger-print-font-size font-weight-bold text-xs-right"
      >Zone: {{ this.$route.query.receiver_zone_name }}</v-flex>
    </v-layout>
    <v-layout row no-gutters>
      <v-flex
        xs12
        class="print-font-size text-xs-left"
      >Address: {{ this.$route.query.receiver_address }}</v-flex>
    </v-layout>
    <v-layout row no-gutters>
      <v-flex
        xs12
        class="print-font-size font-weight-bold text-xs-left mt-1"
      >Note: {{ this.$route.query.remark }}</v-flex>
    </v-layout>
    <v-divider class="mt-1"></v-divider>

    <v-row no-gutters>
      <v-col cols="12">
        <h1
          class="larger-print-font-size font-weight-bold text-center mt-2"
        >AMOUNT TO COLLECT - {{ parseInt(this.$route.query.amount_to_collect_receiver) }}</h1>
        <h1 class="print-font-size text-center">ပို့ဆောင်ခ (၁၀) ဆကိုသာပေးလျော်ပါသည်။</h1>
      </v-col>
    </v-row>
  </v-container>
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