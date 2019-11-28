<template>
  <v-container fluid>
    
<transition name="fade">  
   <v-layout row wrap v-if="changeview" key="sheet">
      <v-flex xs10 offset-xs1>
          <material-cardy color="#283E4A" ref="normal" title="Transaction Sheet">
             <v-btn-toggle
            v-model="toggle_one"
            dense
            background-color="blue"
            dark
            mandatory 
            slot="buttons"
           
          >
            <v-btn @click="changeview=true">
              <v-icon  >view_headline</v-icon> Sheet View
            </v-btn>
  
            <v-btn @click="changeview=false">
              <v-icon>view_list</v-icon>Parcels View
            </v-btn>
  
          </v-btn-toggle>
        <v-data-table
          :headers="headers"
          :items="merchantSheets"
          :items-per-page="15"
          class="elevation-1"
        >
       
          <template v-slot:body="{items}">
          <tbody>

            <tr v-for="(sheet, index) in items" :key="index">
              <td class="blue--text">
                <nuxt-link 
                target="_blank"
                  :to="`/merchant_sheet/${sheet.id}`"
                  >{{ sheet.merchantsheet_invoice }}</nuxt-link>
              </td>
              <td>{{ sheet.qty }}</td>
              <td>{{ sheet.merchant.name }}</td>
              <td>
                <v-chip
                  class="ml-0"
                  small
                  >{{ sheet.is_paid ? "Paid" : "unpaid" }}</v-chip
                >
              </td>
              <td>
                {{sheet.credit}}
              </td>
              <td>
                {{sheet.debit}}
              </td>
              <td>
                    <p v-if="sheet.balance<0">မာရသွန်မှရရန်</p>
                    <p v-else>မာရသွန်သိုပေးရန်</p>
                    {{ Math.abs(sheet.balance )}}
                  </td>
            </tr>
          </tbody>
          </template>
        </v-data-table>
          </material-cardy>
      </v-flex>
    </v-layout>
     <v-layout row wrap v-else key="parcels">
        <material-cardy color="#283E4A" ref="normal" title="Paid Parcels">
          <v-btn-toggle
            v-model="toggle_one"
            dense
            background-color="blue"
            dark
            mandatory 
            slot="buttons"
           
          >
            <v-btn @click="changeview=true">
              <v-icon  >view_headline</v-icon> Sheet View
            </v-btn>
  
            <v-btn @click="changeview=false">
              <v-icon>view_list</v-icon>Parcels View
            </v-btn>
  
          </v-btn-toggle>
      <v-data-table :headers="headers1" :items="paid_vouchers" >
        <template v-slot:body="{items}">
          <tbody>
            <tr v-show="items.length == 0">
              <td colspan="11" class="font-weight-bold">
                <p class="text-center">---Empty---</p>
              </td>
            </tr>

            <tr v-for="(voucher, index) in items" :key="index">
              <td>{{voucher.created_at}}</td>
              <td>{{voucher.voucher_no}}</td>
              <td>
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${voucher.pickup_id}`"
                >{{voucher.pickup.pickup_invoice}}</nuxt-link>
              </td>
              <td>{{voucher.receiver.phone}}---{{voucher.receiver.name}}</td>
             <td>{{voucher.payment_type.name}}</td>
              <td>{{voucher.total_amount_to_collect}}</td>
              <td>{{voucher.total_delivery_amount}}</td>
           
                  <td>{{ voucher.total_bus_fee }}</td>
              <td>
                <p>
                  {{voucher.delivery_status.status}}
                  <spam
                    v-show="voucher.delivery_status.id==9"
                  >({{voucher.is_return?"Return Received":"Yet to Receive"}})</spam>
                </p>
                <p
                  v-if="voucher.assign_sheet?voucher.assign_sheet['return_sheet_invoice']?true:false:false"
                >ReturnSheet ID--{{voucher.assign_sheet.return_sheet_invoice}}</p>
              </td>
              <td>
                <p
                  v-if="voucher.assign_sheet?voucher.assign_sheet['merchantsheet_invoice']?true:false:false"
                >Transaction ID--<nuxt-link
                  target="_blank"
                  :to="`/merchant_sheet/${voucher.assign_sheet.id}`"
                >{{voucher.assign_sheet.merchantsheet_invoice}}</nuxt-link>({{voucher.assign_sheet.is_paid?"Paid":"Unpaid"}})</p>
                <p v-else>Pending</p>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </material-cardy>
     <material-cardy color="#283E4A" ref="normal" title="Unpaid Parcels">
          <v-btn-toggle
            v-model="toggle_one"
            dense
            background-color="blue"
            dark
            mandatory 
            slot="buttons"
           
          >
            <v-btn @click="changeview=true">
              <v-icon  >view_headline</v-icon> Sheet View
            </v-btn>
  
            <v-btn @click="changeview=false">
              <v-icon>view_list</v-icon>Parcels View
            </v-btn>
  
          </v-btn-toggle>
      <v-data-table :headers="headers1" :items="unpaid_vouchers">
        <template v-slot:body="{items}">
          <tbody>
            <tr v-show="items.length == 0">
              <td colspan="11" class="font-weight-bold">
                <p class="text-center">---Empty---</p>
              </td>
            </tr>

            <tr v-for="(voucher, index) in items" :key="index">
              <td>{{voucher.created_at}}</td>
              <td>{{voucher.voucher_no}}</td>
              <td>
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${voucher.pickup_id}`"
                >{{voucher.pickup.pickup_invoice}}</nuxt-link>
              </td>
              <td>{{voucher.receiver.phone}}---{{voucher.receiver.name}}</td>
              <td>{{voucher.payment_type.name}}</td>
              <td>{{voucher.total_amount_to_collect}}</td>
              <td>{{voucher.total_delivery_amount}}</td>
           
                  <td>{{ voucher.total_bus_fee }}</td>
              <td>
                <p>
                  {{voucher.delivery_status.status}}
                  <spam
                    v-show="voucher.delivery_status.id==9"
                  >({{voucher.is_return?"Return Received":"Yet to Receive"}})</spam>
                </p>
                <p
                  v-if="voucher.assign_sheet?voucher.assign_sheet['return_sheet_invoice']?true:false:false"
                >ReturnSheet ID--{{voucher.assign_sheet.return_sheet_invoice}}</p>
              </td>
              <td>
                <p
                  v-if="voucher.assign_sheet?voucher.assign_sheet['merchantsheet_invoice']?true:false:false"
                >Transaction ID--<nuxt-link
                  target="_blank"
                  :to="`/merchant_sheet/${voucher.assign_sheet.id}`"
                >{{voucher.assign_sheet.merchantsheet_invoice}}</nuxt-link>({{voucher.assign_sheet.is_paid?"Paid":"Unpaid"}})</p>
                <p v-else>Pending</p>
              </td>
               <!-- <td>
                    <p v-if="voucher.balance<0">မာရသွန်မှရရန်</p>
                    <p v-else>မာရသွန်သိုပေးရန်</p>
                    {{ Math.abs(voucher.balance )}}
                  </td> -->
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </material-cardy>
     </v-layout>
</transition>
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

  data() {
    return {
      headers: [
        { text: "Merchant Sheet", value: "merchantsheet_invoice" },
        { text: "Vouchers", value: "qty" },
        { text: "Branch", value: "merchant.name" },
        { text: "Payment Status", value: "is_paid" },
        {text:"Receivable", value:"credit"},
        {text:"Payable",value:"debit"},
        {text:"Balance",value:"balance"}
      ],
        headers1: [
        { text: "Date", value: "created_at" },
        { text: "Voucher No", value: "voucher_no" },
        { text: "Pickup No", value: "pickup_id" },
        { text: "Customer", value: "receiver.name" },
       {text:"Payment Type", value:"payment_type.name"},
        {
          text: "AmountToCollect(from customer)",
          value: "total_amount_to_collect",
          width:"10%"
        },
        { text: "Delivery Fee", value: "total_delivery_amount" },
        {text:"Bus Fee", value:"total_bus_fee"},
        { text: "Delivery Status", value: "delivery_status" },
        { text: "Payment Status", value: "is_paid" }
      ],
       changeview:true,
       toggle_one: 0,
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios } = context.app;
    context.store.commit("title/setTitle", "Merchant Finance Sheets");
const { data, status, message } = await api.get_all_merchantsheets($axios, jwt);
let merchantSheets= data
//  const { data:data1, status:status1, message:message1 } = await api.getallvoucher($axios, jwt);
    // let vouchers = data1;
    // let paid_vouchers = vouchers.filter(voucher =>
    //   (voucher.assign_sheet
    //     ? voucher.assign_sheet["merchantsheet_invoice"]
    //       ? true
    //       : false
    //     : false) && voucher.assign_sheet
    //     ? voucher.assign_sheet.is_paid
    //     : false
    // );
    // let unpaid_vouchers=vouchers.filter(voucher =>
    //   (voucher.assign_sheet
    //     ? voucher.assign_sheet["merchantsheet_invoice"]
    //       ? true
    //       : false
    //     : false) && voucher.assign_sheet
    //     ? !voucher.assign_sheet.is_paid
    //     : false
    // );
    let paid_vouchers,unpaid_vouchers
return {
  merchantSheets,
  paid_vouchers ,
  unpaid_vouchers
}
  
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "auth/user"
    })
  },
  methods: {
  

  },
 async created() {
    const { "auth/jwt": jwt } = this.$store.getters;
    const { data:data1, status:status1, message:message1 } = await api.getallvoucher(this.$axios, jwt);
    let vouchers = data1;
    let paid_vouchers = vouchers.filter(voucher =>
      (voucher.assign_sheet
        ? voucher.assign_sheet["merchantsheet_invoice"]
          ? true
          : false
        : false) && voucher.assign_sheet
        ? voucher.assign_sheet.is_paid
        : false
    );
    let unpaid_vouchers=vouchers.filter(voucher =>
      (voucher.assign_sheet
        ? voucher.assign_sheet["merchantsheet_invoice"]
          ? true
          : false
        : false) && voucher.assign_sheet
        ? !voucher.assign_sheet.is_paid
        : false
    );
    this.paid_vouchers=paid_vouchers
    this.unpaid_vouchers=unpaid_vouchers
  },
  mounted() { }
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.8s linear;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-300px);
}
</style>