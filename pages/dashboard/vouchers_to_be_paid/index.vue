<template>
  <v-container fluid>
    <material-cardy color="#283E4A" ref="normal" title="Parcels">
      <v-data-table :headers="headers" :items="vouchers" :search="searcher">
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
                >Transation ID--<nuxt-link
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
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios } = context.app;
    const { data, status, message } = await api.getallvoucher($axios, jwt);
    console.log(data);
    let vouchers = data;
    context.store.commit("title/setTitle", "Parcels to be Paid");
    vouchers = vouchers.filter(voucher =>
      (voucher.assign_sheet
        ? voucher.assign_sheet["merchantsheet_invoice"]
          ? true
          : false
        : false) && voucher.assign_sheet
        ? !voucher.assign_sheet.is_paid
        : false
    );
    return { vouchers };
  },
  data() {
    return {
      headers: [
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
      searcher: ""
    };
  }
};
</script>