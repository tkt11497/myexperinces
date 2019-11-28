<template>
  <v-container fluid>
  
    <material-cardx color="#283E4A" ref="normal" text="Parcels">
      <v-switch v-model="v_filter" label="All Parcels" value="all" slot="searchy"></v-switch>
      <!-- <v-select
          :items="v_items"
          filled
          label="Filled style"
          v-model="v_filter1" 
          slot="buttons"
        ></v-select> -->
      <v-radio-group v-model="v_filter1"  class="ma-0 pl-1 pt-0 pr-0 pb-0" slot="buttons" row > 
            
              <v-radio
                label="Show All"
                color="#4CAF50"
                value="unselect" 
                on-icon="done_all"
              ></v-radio>
               <v-radio
                label="Delivering Parcels"
                color="#4CAF50"
                value="delivering_vouchers"
                on-icon="done_all"
              ></v-radio>
          
              <v-radio
                label="Delivered Parcels"
                color="#4CAF50"
                value="delivered" 
                on-icon="done_all"
              ></v-radio>
              
             
              <v-radio
                label="Can't Deliver Parcels"
                color="orange"
                value="cant_deliver_vouchers" 
                on-icon="done_all"
              ></v-radio>
           
              <v-radio
                label="Parcels tobe Paid"
                color="#4CAF50"
                value="vouchers_to_be_paid" 
                on-icon="done_all"
              ></v-radio>
              <v-radio
                label="Paid Parcels"
                color="#4CAF50"
                value="paid_vouchers" 
                on-icon="done_all"
              ></v-radio>
            
              <v-radio
                label="On-going Return Parcels"
                color="orange"
                value="ongoing_return" 
                on-icon="done_all"
              ></v-radio>
                <v-radio
                label="Received-Return Parcels"
                color="#4CAF50"
                value="returned_v" 
                on-icon="done_all"
              ></v-radio>
               
            </v-radio-group> 
      <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
            @input="onChangeDate" 
            slot="button1" 
            v-if="dateshow"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                autocomplete="off"
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
              <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
          
                <v-text-field
        autocomplete="off"
        v-model="searcher"
        append-icon="search"
        label="Search"
        single-line
        hide-details
        slot="datey"
        class="mt-1"
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
              <td>{{voucher.created_at}}</td>
              <td>{{voucher.voucher_no}}</td>
              <td>
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${voucher.pickup_id}`"
                >{{voucher.pickup.pickup_invoice}}</nuxt-link>
              </td>
              <td>{{voucher.receiver.phone}}---{{voucher.receiver.name}}</td>
              <td><p v-if="voucher.remark">{{voucher.remark}}</p><p v-else>--Empty--</p></td>
              <td>{{voucher.total_amount_to_collect}}</td>
              <td>{{voucher.total_delivery_amount}}</td>
          <td>
                <p>
                  {{voucher.delivery_status.status}}
                  <span
                    v-show="voucher.delivery_status.id==9"
                  >({{voucher.is_return?"Return Received":"Yet to Receive"}})</span>
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
    </material-cardx>
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
    const loadedvouchers = data;
    context.store.commit("title/setTitle", "Total Parcels");
    return { loadedvouchers };
  },
  data() {
    return {
       date: "",
      dateMenu: false,
      headers: [
        { text: "Date", value: "created_at" },
        { text: "Voucher No", value: "voucher_no" },
        { text: "Pickup No", value: "pickup_id" },
        { text: "Customer", value: "receiver.name" },
        {text:"Note",value:"remark"},
        {
          text: "AmountToCollect(from customer)",
          value: "total_amount_to_collect",
          width:"10%"
        },
        { text: "Delivery Fee", value: "total_delivery_amount" },
        { text: "Delivery Status", value: "delivery_status.status "},
        { text: "Payment Status", value: "is_paid" }
      ],
      searcher: "",
      v_filter: ['all'],
      v_filter1:"unselect",
      loadedvouchersbydate:[],
      dateshow:false,
      v_items:[
                 {text:"Select None" ,value: "unselect"},
                {text:"Delivering Parcels" ,value: "delivering_vouchers"},
                {text:"Can't Deliver Parcels" ,value: "cant_deliver_vouchers"},
                  {text:"Delivered Parcels" ,value: "delivered"},
                    {text:"Parcels Tobe Paid" ,value: "vouchers_to_be_paid"},
                     {text:"Paid Parcels" ,value: "paid_vouchers"},
                     {text:"On-going Return Parcels" ,value: "ongoing_return"},
                       {text:"Received-return Parcels" ,value: "returned_v"},
      
      
      
      
              ]
    };
  },
  methods:{
     async onChangeDate() {
      if (!event) {
        const { "auth/jwt": jwt, "auth/user": user } = this.$store.getters;
       const { data, status, message }= await this.$api.getvoucherbydate(
          this.$axios,
          jwt,
          this.date
        )
        this.loadedvouchersbydate=[...data]
      
      }
    }
  },
  computed:{
    vouchers() {
       const keyword = new Set( this.v_filter);
       let vouchers=[]
       if(keyword.has("all")){
         vouchers=[...this.loadedvouchers]
         this.dateshow=false
       }else{
         this.dateshow=true
         vouchers=[...this.loadedvouchersbydate]
       }
 
    if(this.v_filter1=="delivered"){
      vouchers=vouchers.filter(voucher => voucher.delivery_status.id == 8);
    }
    
    if(this.v_filter1=="delivering_vouchers"){
      vouchers=vouchers.filter(
      voucher =>
        voucher.delivery_status.id == 1 || voucher.delivery_status.id == 2
    );
    }
    if(this.v_filter1=="cant_deliver_vouchers"){
      vouchers=vouchers.filter(
      voucher =>
        voucher.delivery_status.id != 1 &&
        voucher.delivery_status.id != 2 &&
        voucher.delivery_status.id != 8 &&
        voucher.delivery_status.id != 9
    );
    }
      if(this.v_filter1=="vouchers_to_be_paid"){
      vouchers=vouchers.filter(voucher =>
      (voucher.assign_sheet
        ? voucher.assign_sheet["merchantsheet_invoice"]
          ? true
          : false
        : false) && voucher.assign_sheet
        ? !voucher.assign_sheet.is_paid
        : false
    );
    }
     if(this.v_filter1=="paid_vouchers"){
      vouchers=vouchers.filter(voucher =>
      (voucher.assign_sheet
        ? voucher.assign_sheet["merchantsheet_invoice"]
          ? true
          : false
        : false) && voucher.assign_sheet
        ? voucher.assign_sheet.is_paid
        : false
    );
    }
       if(this.v_filter1=="ongoing_return"){
      vouchers=vouchers.filter(
      voucher => voucher.delivery_status.id == 9 && !voucher.is_return
    );
    } 
    if(this.v_filter1=="returned_v"){
      vouchers=vouchers.filter(
      voucher => voucher.is_return && voucher.delivery_status.id == 9
    );
    }   
       

     
  return vouchers
  }
  }
};
</script>