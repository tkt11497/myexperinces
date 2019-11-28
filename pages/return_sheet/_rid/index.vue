<template>
   <v-container fluid>
    <material-cardy color="#283E4A" ref="normal" text="returnsheet.return_sheet_invoice">
           <v-text-field
              label="Total Return Fee"
              v-model="totalAmountToCollect"
              disabled
              slot="searchy"
              mt-0
            ></v-text-field>
      <v-data-table :headers="headers" :items="vouchers" :search="searcher">
        <template v-slot:body="{items}">
          <tbody>
            <tr v-show="items.length == 0">
              <td colspan="11" class="font-weight-bold">
                <p class="text-center">---Empty---</p>
              </td>
            </tr>

            <tr v-for="(voucher, index) in items" :key="index">
              <td>{{voucher.pickup.created_at}}</td>
              <td>{{returnsheet.created_at}}</td>
              <td>{{voucher.voucher_no}}</td>
              <td>
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${voucher.pickup.id}`"
                >{{voucher.pickup.pickup_invoice}}</nuxt-link>
              </td>
              <td>{{voucher.receiver.phone}}---{{voucher.receiver.name}}</td>
              <td>{{voucher.return_type}}</td>
              <td>{{voucher.return_fee}}</td>
              
              <td>
                <p>
                  {{voucher.delivery_status.status}}
                  <spam
                    v-show="voucher.delivery_status.id==9"
                  >({{returnsheet.is_returned?"Return Received":"Yet to Receive"}})</spam>
                </p>
                <p
                  v-if="voucher.assign_sheet?voucher.assign_sheet['return_sheet_invoice']?true:false:false"
                >ReturnSheet ID--  <nuxt-link
                        target="_blank"
                        :to="`/return_sheet/${voucher.assign_sheet.id}`"
                      >{{voucher.assign_sheet.return_sheet_invoice}}</nuxt-link></p>
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
import helpers from "@/assets/utilities/helpers/pickupDetails";
export default {
    middleware: ["auth"],
      async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios } = context.app;
    const { data, status, message } = await api.get_returnsheet_detail($axios, jwt,context.route.params.rid);
    console.log(data);
    let vouchers = data.vouchers;
    let returnsheet=data
    context.store.commit("title/setTitle", `Return Sheet- ${returnsheet.return_sheet_invoice}`);
    return {vouchers ,returnsheet };
  },
  data() {
    return {
      headers: [
        { text: "Pickup Date", value: "created_at" },
        {text:" Return Date",value:"returnSheet.created_at"},
        { text: "Voucher No", value: "voucher_no" },
        { text: "Pickup No", value: "pickup_id" },
        { text: "Customer", value: "receiver.name" },
         { text: "Return Type", value: "return_type" },
        {
          text: "Return Fee",
          value: "return_fee"
        },
       
        { text: "Delivery Status", value: "delivery_status" },
        { text: "Payment Status", value: "is_paid" }
      ],
      searcher: ""
    };
  },
     computed:{
      ...mapGetters({
      jwt: "auth/jwt",
      user: "auth/user"
    }),
    totalAmountToCollect() {
      let totalAmount = 0;
      this.vouchers.forEach(voucher => {
        totalAmount += parseInt(voucher.return_fee);
      });
      return `${totalAmount} Ks`;
    },
    }
}
</script>