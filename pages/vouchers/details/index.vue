<template>
  <div>
    <div class="px-5 pt-3 no-print">
      <div @shortkey="showLogs" v-shortkey="['ctrl', '1']"></div>
      <v-layout>
        <v-flex xs4 px-2>
          <SenderInfo :pickup="pickup"></SenderInfo>
          <div style="height: 20px"></div>
          <NormalReceiverLocation v-if="!voucher.bus_station" :cities="cities" :voucher="voucher"></NormalReceiverLocation>
          <StationCardOne
            v-if="voucher.bus_station"
            :voucher="voucher"
            :cities="cities"
            :stations="stations"
            :gates="gates"
            :metas="metas"
          ></StationCardOne>
        </v-flex>
        <!-- second column -->
        <v-flex xs4 px-2>
          <ReceiverInfo :voucher="voucher"></ReceiverInfo>
          <div style="height: 20px"></div>
          <CardTwo
            :voucher="voucher"
            :customerDutyStaffs="customerDutyStaffs"
            :delegateDurations="delegateDurations"
            :callStatuses="callStatuses"
            :storeStatuses="storeStatuses"
            :gates="gates"
          ></CardTwo>
        </v-flex>
        <!-- third column -->
        <v-flex xs4 px-2 pl-3>
          <v-layout>
            <v-btn :disabled="voucher.is_closed" color="primary" @click="onSaveVoucher">
              {{
              voucher.id ? "Update Voucher" : "Save Voucher"
              }}
            </v-btn>
            <!-- <v-btn :disabled="voucher.is_closed" @click="onCloseVoucher">Close Voucher</v-btn> -->
            <v-btn
              color="primary"
              @click="onReturnVoucher"
              :disabled="voucher.delivery_status.id === 9 || voucher.is_closed"
            >Return Voucher</v-btn>
          </v-layout>
          <v-layout px-3 pt-1>
            <v-flex xs4 font-weight-bold>PICKUP</v-flex>
            <v-flex xs8>
              <nuxt-link target="_blank" :to="`/pickups/${pickup.id}`">{{ pickup.pickup_invoice }}</nuxt-link>
            </v-flex>
          </v-layout>
          <v-layout px-3 pb-1>
            <v-flex xs4 font-weight-bold>VOUCHER</v-flex>
            <v-flex xs8>{{ voucher.voucher_no || "not created yet" }}</v-flex>
          </v-layout>
          <v-layout px-3 pb-1>
            <v-flex xs4 font-weight-bold>ASSIGN SHEET</v-flex>

            <v-flex xs8>
              <nuxt-link target="_blank" :to="assignSheetURL">{{ assignSheetID }}</nuxt-link>
            </v-flex>
          </v-layout>
          <v-card>
            <v-layout px-3>
              <v-text-field browser-autocomplete="off" label="Note" v-model="voucher.remark"></v-text-field>
            </v-layout>
            <v-layout px-3 align-center v-show="pickup.sender_type === 'Merchant'">
              <v-flex xs2>Postpone:</v-flex>
              <v-flex xs9>
                <v-btn
                  :disabled="voucher.is_closed"
                  color="primary"
                  flat
                  block
                  @click="pickerDialog = !pickerDialog"
                >{{ voucher.postpone_date || "not selected" }}</v-btn>
              </v-flex>
              <v-flex xs1>
                <v-btn :disabled="voucher.is_closed" flat icon color="pink" @click="delPostpone">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout px-3>
              <v-autocomplete
                :disabled="voucher.is_closed"
                :items="getPaymentTypes()"
                label="Payment Type"
                v-model="voucher.payment_type"
                item-value="id"
                item-text="name"
              ></v-autocomplete>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <Parcels
        :voucher="voucher"
        :globalScales="globalScales"
        @onDelItem="onDelItem"
        @onDelParcel="onDelParcel"
        @addNewItem="addNewItem"
        @checkValidCoupon="checkValidCoupon"
        @onUnlockParcel="onUnlockParcel"
        @onUnlockItem="onUnlockItem"
      ></Parcels>
      <v-layout justify-end mt-3>
        <v-spacer></v-spacer>
        <v-switch
          v-if="voucher.bus_station === 0"
          :disabled="voucher.is_closed"
          color="primary"
          v-model="voucher.take_insurance"
          label="Insurance"
        ></v-switch>
        <v-btn v-print color="primary">Print Voucher</v-btn>
        <v-btn
          :disabled="voucher.is_closed"
          color="primary"
          @click="addNewParcel({ voucher })"
        >Make Parcel</v-btn>
      </v-layout>
      <v-layout mt-5>
        <v-flex xs6 v-if="!voucher.id"></v-flex>
        <v-flex xs6 v-else>
          <v-layout mt-3 class="title blue--text">
            <v-btn
              color="primary"
              @click="showLogs"
              v-if="voucher.id"
            >{{ interpretedLogs.length === 0 ? "Show Logs " : "Update Logs " }}</v-btn>
            <v-dialog v-model="dialog" scrollable width="1500">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" v-on="on" :disabled="!voucher.attachments.length">Show Images</v-btn>
              </template>

              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>Vouchers Images</v-card-title>

                <v-card-text>
                  <v-layout row wrap>
                    <v-flex
                      xs4
                      v-for="attachment in voucher.attachments"
                      :key="attachment.image"
                      pb-3
                      pr-3
                    >
                      <v-img
                        :src="attachment.image_url"
                        :lazy-src="attachment.medium_image_url"
                        class="grey lighten-2"
                      ></v-img>
                      <div class="subheading">{{ attachment.note }}</div>
                      <div class="text-xs-center">
                        <v-btn
                          color="primary"
                          small
                          offset-xs2
                          @click="showImage(attachment)"
                        >{{ attachment.is_show_merchant ? 'Hide Merchant' : 'Show Merchant' }}</v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-layout mt-2 pr-5>
            <AppLog :interpretedLogs="interpretedLogs"></AppLog>
          </v-layout>
        </v-flex>
        <v-flex xs3 />
        <v-flex xs3>
          <v-layout mt-3 class="title blue--text">Extra Charges</v-layout>

          <MoneyInformation title="Transaction Fee" :information="voucher.transaction_fee || '0'" />

          <v-layout mt-2 v-if="voucher.bus_station === 0">
            <v-flex xs5>Insurance fee</v-flex>
            <v-flex xs7 style="text-align: right">
              {{ voucher.insurance_fee }}
              <span class="red--text">{{ voucher.insurance_percentage }}</span>
            </v-flex>
          </v-layout>

          <MoneyInformation title="Warehousing Fee" :information="voucher.warehousing_fee || '0'" />
          <v-layout mt-3 class="title blue--text">Parcel Price</v-layout>

          <MoneyInformation
            v-for="(parcel, index) in voucher.parcels"
            :key="'parcelPrice' + index"
            :title="`Parcel ${index + 1}`"
            :information="parcel.label_parcel_price || '0'"
          />

          <v-layout mt-3 class="title blue--text">Delivery Price</v-layout>

          <MoneyInformation
            v-for="(parcel, index) in voucher.parcels"
            :key="'deliveryPrice' + index"
            :title="`Parcel ${index + 1}`"
            :information="parcel.label_delivery_price || '0'"
          />

          <v-layout mt-3 class="title blue--text">Discounts</v-layout>

          <MoneyInformation
            v-for="(parcel, index) in voucher.parcels"
            :key="'discount' + index"
            :title="`Parcel ${index + 1}`"
            :information="parcel.discount_price || '0'"
          />

          <div v-if="voucher.bus_station">
            <v-layout mt-3 class="title blue--text">Bus Car Price</v-layout>
            <MoneyInformation
              v-for="(parcel, index) in voucher.parcels"
              :key="'gatePrice' + index"
              :title="`Parcel ${index + 1}`"
              :information="parcel.label_gate_price || '0'"
            />
          </div>

          <v-layout mt-3 class="title blue--text">Grand Total</v-layout>

          <MoneyInformation title="Total  Discount" :information="voucher.total_discount_amount" />

          <MoneyInformation
            title="Total  Delivery Fee"
            :information="voucher.total_delivery_amount.toString() || '0'"
          />

          <MoneyInformation
            title="Grand Subtotal"
            :information="voucher.grand_sub_total.toString() || '0'"
          />
          <v-layout mt-3 class="title blue--text">Amount to be Paid</v-layout>

          <MoneyInformation title="ATC Sender" :information="voucher.amount_to_collect_sender" />
          <MoneyInformation title="ATC Receiver" :information="voucher.amount_to_collect_receiver" />
        </v-flex>
      </v-layout>
      <v-layout>
        <div style="height: 80px"></div>
      </v-layout>
      <v-dialog v-model="pickerDialog" max-width="300">
        <v-date-picker
          :min="minDate"
          v-model="voucher.postpone_date"
          full-width
          @change="dateChangeHandler"
        ></v-date-picker>
      </v-dialog>
      <v-layout row justify-center>
        <v-dialog v-model="isOpenActionDialog" width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ actionMessage }}</span>
            </v-card-title>
            <v-card-actions>
              <v-btn color="green darken-1" flat="flat" @click="cancelAction">Cancel</v-btn>
              <v-btn color="red darken-1" flat="flat" @click="submitAction">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-layout row justify-center>
        <v-dialog v-model="errorDialog" width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ errorMessage }}</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" flat="flat" @click="errorDialog = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
        {{ snackbarMessage }}
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>

      <AppLoading :isLoading="isLoading"></AppLoading>
    </div>
    <div id="printVoucher">
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
      <h1 class="print-font-size text-xs-center mt-2">ပေးပို့သူ</h1>
      <v-layout row>
        <v-flex
          xs12
          class="larger-print-font-size font-weight-bold text-xs-left"
        >Name: {{ pickup.sender.name }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          xs12
          class="print-font-size text-xs-left"
        >Phone: {{ pickup.sender_type === "Merchant" ? pickup.sender_associate.phones.join(", ") : pickup.sender.phone }}</v-flex>
      </v-layout>
      <v-divider class="mt-1"></v-divider>
      <h1 class="print-font-size text-xs-center mt-2">လက်ခံသူ</h1>
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
          class="larger-print-font-size font-weight-bold text-xs-left"
        >Zone: {{ voucher.receiver_zone ? voucher.receiver_zone.name : '' }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 class="print-font-size text-xs-left">Address: {{ voucher.receiver.address }}</v-flex>
      </v-layout>
      <v-layout row>
        <v-flex
          xs12
          class="print-font-size font-weight-bold text-xs-left mt-1"
        >Note: {{ voucher.remark || "--Empty--" }}</v-flex>
      </v-layout>
      <v-divider class="mt-1"></v-divider>
      <h1
        class="larger-print-font-size font-weight-bold text-xs-center mt-2"
      >AMOUNT TO COLLECT - {{ parseInt(voucher.amount_to_collect_receiver) }}</h1>
      <h1 class="print-font-size text-xs-center">ပို့ဆောင်ခ (၁၀) ဆကိုသာပေးလျော်ပါသည်။</h1>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData,
  interpretLog,
  getAllLocalForage,
  getId
} from "@/assets/utilities/helpers/common";
import moment from "moment";
import {
  lockParcelItems,
  lockParcels,
  getMode,
  defaultParcels,
  defaultVoucher,
  defaultItem,
  defaultParcel,
  filterPaymentTypes
} from "@/assets/utilities/helpers/voucherDetails";
import AppLoading from "@/components/App/loading.vue";
import AppLog from "@/components/App/Log.vue";
import SenderInfo from "@/components/VoucherDetails/SenderInfo.vue";
import NormalReceiverLocation from "@/components/VoucherDetails/NormalReceiverLocation.vue";
import ReceiverInfo from "@/components/VoucherDetails/ReceiverInfo.vue";
import StationCardOne from "@/components/VoucherDetails/StationCardOne.vue";
import CardTwo from "@/components/VoucherDetails/CardTwo.vue";
import Parcels from "@/components/VoucherDetails/Parcels.vue";
import MoneyInformation from "@/components/VoucherDetails/MoneyInformation.vue";

export default {
  middleware: ["auth"],
  components: {
    AppLoading,
    AppLog,
    SenderInfo,
    NormalReceiverLocation,
    ReceiverInfo,
    StationCardOne,
    CardTwo,
    Parcels,
    MoneyInformation
  },
  async asyncData(context) {
    let mode = "";
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios, $api } = context.app;
    const { type } = context.query;

    const storedRecords = await getAllLocalForage();
    mode = getMode({ type });
    if (mode === "newStation") {
      const { pickupId } = context.query;
      const { status, data } = await $api.getPickupsDetails(
        $axios,
        jwt,
        pickupId
      );
      await handleStatusInAsyncData({ context, status });
      if (status !== 1) return;
      const pickupData = data;
      return {
        ..._.cloneDeep({
          ...storedRecords,
          pickup: pickupData,
          voucher: {
            ...defaultVoucher,
            bus_station: 1,
            interpretedLogs: []
          }
        })
      };
    } else if (mode === "newNormal") {
      const { pickupId } = context.query;
      const { status, data } = await $api.getPickupsDetails(
        $axios,
        jwt,
        pickupId
      );
      await handleStatusInAsyncData({ context, status });
      if (status !== 1) return;
      const pickupData = data;
      return {
        ..._.cloneDeep({
          ...storedRecords,
          pickup: pickupData,
          voucher: {
            ...defaultVoucher,
            bus_station: 0,
            interpretedLogs: []
          }
        })
      };
    }

    const { voucherId } = context.query;
    let { status, data } = await $api.getVouchersDetails(
      $axios,
      jwt,
      voucherId
    );
    const voucherData = data;
    voucherData.parcels = lockParcels(voucherData.parcels);
    context.store.commit("title/setTitle", "Voucher Details - Operation");
    return {
      ...storedRecords,
      pickup: voucherData.pickup,
      voucher: { ...defaultVoucher, ...voucherData },
      interpretedLogs: []
    };
  },
  data() {
    return {
      dialog: false,
      snackbarMessage: "",
      snackbar: false,
      isLoading: false,
      pickerDialog: false,
      actionMessage: "",
      isOpenActionDialog: false,
      errorDialog: false,
      errorMessage: "",
      minDate: moment().format("YYYY-MM-DD"),
      deletedIds: { parcelIds: [], itemIds: [] },
      pickup: { sender: {}, is_closed: false },
      voucher: defaultVoucher,
      printHeaders: [
        { text: "Item", sortable: false },
        { text: "Quantity", sortable: false },
        { text: "Price", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    }),
    assignSheetID() {
      return this.voucher.assign_sheet
        ? this.voucher.assign_sheet.delisheet_invoice ||
            this.voucher.assign_sheet.waybill_invoice ||
            this.voucher.assign_sheet.bus_sheet_invoice ||
            this.voucher.assign_sheet.merchantsheet_invoice ||
            this.voucher.assign_sheet.return_sheet_invoice
        : "not assign yet";
    },
    assignSheetURL() {
      let assignSheetURL = `/vouchers/details?voucherId=${this.voucher.id}`;
      if (this.voucher.assign_sheet) {
        assignSheetURL = this.voucher.assign_sheet.delisheet_invoice
          ? `/dashboard/deli_sheets/${this.voucher.assign_sheet.id}`
          : this.voucher.assign_sheet.waybill_invoice
          ? `/dashboard/waybills/${this.voucher.assign_sheet.id}`
          : this.voucher.assign_sheet.bus_sheet_invoice
          ? `/dashboard/bus_sheets/close/?id=${this.voucher.assign_sheet.id}`
          : this.voucher.assign_sheet.merchantsheet_invoice
          ? `/dashboard/merchant_sheets/${this.voucher.assign_sheet.id}`
          : this.voucher.assign_sheet.return_sheet_invoice
          ? `/dashboard/return_sheets/${this.voucher.assign_sheet.id}`
          : assignSheetURL;
      }
      return assignSheetURL;
    }
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    getPaymentTypes() {
      try {
        const { paymentTypes } = this;
        const voucherType =
          this.voucher.bus_station == 0 ? "normal" : "station";
        const customerType = this.pickup.sender_type;
        if (this.voucher.bus_station == 1) {
          const senderGate = this.gates.find(
            ({ id }) => id === getId(this.voucher.sender_gate)
          );
          return filterPaymentTypes({
            paymentTypes,
            voucherType,
            customerType,
            isDebit: senderGate.gate_debit
          });
        } else {
          return filterPaymentTypes({
            paymentTypes,
            voucherType,
            customerType
          });
        }
      } catch (error) {
        return [];
      }
    },
    getPaymentStatus() {
      try {
        const paymentTypeId = getId(this.voucher.payment_type);
        const currentPaymentType = this.paymentTypes.find(
          ({ id }) => id === paymentTypeId
        );
        return currentPaymentType.status;
      } catch (error) {
        return "";
      }
    },
    async showLogs() {
      const { data, status, message } = await this.$api.getVoucherHistories({
        axios: this.$axios,
        jwt: this.jwt,
        id: this.voucher.id
      });
      const results = interpretLog({
        logs: data,
        logStatuses: this.logStatuses,
        staffs: this.staffs,
        deliveryStatuses: this.deliveryStatuses,
        storeStatuses: this.storeStatuses
      });
      this.interpretedLogs = results;
    },
    async onCloseVoucher() {
      const { voucher, jwt } = this;
      const { status, data } = await this.$api.closeVoucher({
        id: voucher.id,
        jwt
      });
      this.voucher.is_closed = data.is_closed;
    },
    async showImage(attachment) {
      const { jwt } = this;
      let responseData = {};
      if (attachment.is_show_merchant) {
        const { status, data } = await this.$api.HideImage({
          id: attachment.id,
          jwt
        });
        responseData = data;
      } else {
        const { status, data } = await this.$api.showImage({
          id: attachment.id,
          jwt
        });
        responseData = data;
      }
      let index = this.voucher.attachments.findIndex(
        attachment => attachment.id === responseData.id
      );
      this.voucher.attachments.splice(index, 1, responseData);
    },
    async onReturnVoucher() {
      const { voucher, jwt } = this;
      const { status, data } = await this.$api.returnVoucher({
        id: voucher.id,
        jwt
      });
      this.voucher.delivery_status.id = 9;
    },
    delPostpone() {
      this.voucher.postpone_date = null;
    },
    async checkValidCoupon(parcel) {
      if (!parcel.tempCoupon) return;
      const { $axios, jwt } = this;
      this.isLoading = true;
      const { status, data, message } = await api.checkValidCoupon({
        axios: $axios,
        jwt,
        coupon: parcel.tempCoupon
      });
      this.isLoading = false;
      if (status === 1) {
        this.openSnackBar({ snackbarMessage: "Coupon applied successfully." });
        parcel.coupon.code = parcel.tempCoupon;
        parcel.isLocked = true;
      } else if (status === 2) {
        this.openSnackBar({ snackbarMessage: "Coupon is not valid" });
        this.$forceUpdate();
      }
    },
    openSnackBar({ snackbarMessage }) {
      this.snackbarMessage = snackbarMessage;
      this.snackbar = true;
    },
    makeParcels() {
      this.lockAllRows();
      this.voucher.parcels.push({
        amount_to_collect: 0,
        delivery_amount: 0,
        discount_amount: 0,
        global_scale_id: 1,
        isLocked: true,
        tempCoupon: "",
        coupon: { code: "" },
        parcel_items: [
          {
            isLocked: false,
            item_name: "Item",
            item_price: 0,
            item_qty: 1,
            item_status: null,
            parcel_id: null
          }
        ],
        voucher_id: this.voucher.id,
        global_scale: {
          description: this.globalScales[0].description,
          id: this.globalScales[0].id
        },
        weight: this.globalScales[0].support_weight
      });
    },
    askConfirmation(action) {
      if (action === "edit") {
        this.action = action;
        this.isOpenActionDialog = true;
        this.actionMessage = "Edit item confirmation";
      } else if (action === "beingEdited") {
        this.action = action;
        this.isOpenActionDialog = true;
        this.actionMessage = "Another row is being edited";
      }
    },
    dateChangeHandler() {
      this.pickerDialog = false;
    },
    addNewItem({ parcel }) {
      this.lockAllRows();
      parcel.parcel_items.push(_.cloneDeep(defaultItem));
    },
    addNewParcel({ voucher }) {
      this.lockAllRows();
      voucher.parcels.push(_.cloneDeep(defaultParcel));
    },
    showErrorDialog(message) {
      this.errorDialog = true;
      this.errorMessage = message;
    },
    onDelItem({ parcel, item, iIndex }) {
      if (parcel.parcel_items.length <= 1)
        this.showErrorDialog("The items cannot be empty.");
      else {
        parcel.parcel_items.splice(iIndex, 1);
        if (item.id) this.deletedIds.itemIds.push(deletedItem.id);
      }
    },
    onDelParcel({ parcels, parcel, pIndex }) {
      console.log("TCL: onDelParcel -> parcels", parcels);
      if (parcels.length <= 1)
        this.showErrorDialog("The parcels cannot be empty.");
      else {
        parcels.splice(pIndex, 1);
        if (parcel.id) {
          this.deletedIds.parcelIds.push(parcel.id);
        }
      }
    },
    buildPayloadForParcels(parcels) {
      return parcels.map(parcel => ({
        ...parcel,
        global_scale_id: getId(parcel.global_scale)
      }));
    },
    buildPayload() {
      const { voucher, pickup } = this;
      const { receiver } = voucher;
      const receiverPayload = {
        receiver_name: receiver.name,
        receiver_phone: receiver.phone,
        other_phone: receiver.other_phone,
        receiver_address: receiver.address,
        receiver_id: receiver.id
      };
      const receiverLocationPayload = {
        receiver_city_id: getId(voucher.receiver_city),
        sender_bus_station_id: getId(voucher.sender_bus_station),
        receiver_bus_station_id: getId(voucher.receiver_bus_station),
        receiver_gate_id: getId(voucher.receiver_gate),
        sender_gate_id: getId(voucher.sender_gate),
        receiver_zone_id: getId(voucher.receiver_zone)
      };
      const customerRelationPayload = {
        call_status_id: getId(voucher.call_status),
        store_status_id: getId(voucher.store_status),
        delegate_person: getId(voucher.delegate_person),
        delegate_duration_id: getId(voucher.delegate_duration)
      };
      const otherInfoPayload = {
        payment_type_id: getId(voucher.payment_type),
        remark: voucher.remark,
        deletedIds: this.deletedIds,
        parcels: this.buildPayloadForParcels(voucher.parcels),
        take_insurance: voucher.take_insurance ? 1 : 0,
        pickup_id: pickup.id,
        bus_station: voucher.bus_station,
        postpone_date: voucher.postpone_date
      };
      const payload = {
        ...receiverPayload,
        ...receiverLocationPayload,
        ...customerRelationPayload,
        ...otherInfoPayload
      };
      console.log("TCL: buildPayload -> payload", payload);
      return payload;
    },
    updateVoucherStatus({ serverResponse }) {
      this.deletedIds = { parcelIds: [], itemIds: [] };
      this.voucher.parcels = lockParcels(serverResponse.parcels);
      this.voucher.voucher_no = serverResponse.voucher_no;
      this.voucher.total_item_price = serverResponse.total_item_price;
      this.voucher.total_delivery_amount = serverResponse.total_delivery_amount;
      this.voucher.total_amount_to_collect =
        serverResponse.total_amount_to_collect;
      this.voucher.total_discount_amount = serverResponse.total_discount_amount;
      this.voucher.total_coupon_amount = serverResponse.total_coupon_amount;
      this.voucher.total_bus_fee = serverResponse.total_bus_fee;
      this.voucher.transaction_fee = serverResponse.transaction_fee;
      this.voucher.take_insurance = !!serverResponse.take_insurance;
      this.voucher.insurance_fee = serverResponse.insurance_fee;
      this.voucher.insurance_percentage = serverResponse.insurance_percentage;
      this.voucher.warehousing_fee = serverResponse.warehousing_fee;
      this.voucher.grand_sub_total = serverResponse.grand_sub_total;
      this.voucher.payment_type = serverResponse.payment_type.id;
      this.voucher.postpone_date = serverResponse.postpone_date;
      this.voucher.amount_to_collect_sender =
        serverResponse.amount_to_collect_sender;
      this.voucher.amount_to_collect_receiver =
        serverResponse.amount_to_collect_receiver;
      this.voucher.is_closed = serverResponse.is_closed;
      this.voucher.delegate_duration = serverResponse.delegate_duration;
      this.voucher.delegate_person = serverResponse.delegate_person;
      this.voucher.debit_amount = serverResponse.debit_amount;
      this.voucher.credit_amount = serverResponse.credit_amount;
      this.voucher.balance = serverResponse.balance;
      this.voucher.id = serverResponse.id;
      this.voucher.receiver.id = serverResponse.receiver.id;
      this.interpretedLogs = [];
    },
    buildUpdateStatusPayload() {
      const {
        payment_type,
        delivery_status,
        store_status,
        call_status,
        delegate_person,
        delegate_duration,
        remark,
        receiver
      } = this.voucher;
      const payment_type_id = getId(payment_type);
      const delivery_status_id = getId(delivery_status);
      const store_status_id = getId(store_status);
      const call_status_id = getId(call_status);
      const delegate_person_id = getId(delegate_person);
      const delegate_duration_id = getId(delegate_duration);
      const receiver_id = getId(receiver.id);
      const receiver_name = receiver.name;
      const receiver_phone = receiver.phone;
      const other_phone = receiver.other_phone;
      const receiver_address = receiver.address;
      return {
        payment_type_id,
        delivery_status_id,
        store_status_id,
        call_status_id,
        delegate_person: delegate_person_id,
        delegate_duration_id,
        note: remark,
        receiver_id,
        receiver_name,
        receiver_phone,
        other_phone,
        receiver_address
      };
    },
    async onSaveVoucher() {
      if (!this.voucher.receiver.address && this.voucher.bus_station == 0)
        return; //validate optinal address for custormers
      if (this.voucher.is_closed) {
        const payload = this.buildUpdateStatusPayload();
        const { data, status, message } = await this.$api.updateVoucherStatus({
          jwt: this.jwt,
          $axios: this.$axios,
          id: this.voucher.id,
          payload
        });
        handleStatus({
          that: this,
          successMessage: "Updated",
          status,
          message
        });
        return;
      } else {
        const payload = this.buildPayload();
        this.isLoading = true;
        const {
          data,
          status,
          message
        } = (await this.$api.createUpdateVoucherDetails(this, {
          payload,
          id: this.voucher.id
        })).data;
        this.isLoading = false;
        handleStatus({
          that: this,
          successMessage: "Updated",
          status,
          message
        });
        if (status !== 1) return;
        this.updateVoucherStatus({ serverResponse: data });
      }
    },

    lockAllRows() {
      const newParcels = lockParcels(this.voucher.parcels);
      this.voucher.parcels = newParcels;
    },
    cancelAction() {
      this.lockAllRows();
      this.isOpenActionDialog = false;
    },
    submitAction() {
      this.lockAllRows();
      this.isOpenActionDialog = false;
    },
    checkIfAnyRowIsOpened() {
      let isOpened = false;
      this.voucher.parcels.forEach(parcel => {
        if (!parcel.isLocked) isOpened = true;
        parcel.parcel_items.forEach(item => {
          if (!item.isLocked) isOpened = true;
        });
      });
      return isOpened;
    },
    async onUnlockParcel({ parcel }) {
      this.lockAllRows();
      parcel.isLocked = false;
    },
    async onUnlockItem({ item }) {
      this.lockAllRows();
      item.isLocked = false;
    }
  },
  mounted() {
    this.setNavigationShow(true);
    if (window.history.length > 1) this.setNavigationUrl("history");
    else this.setNavigationShow(false);
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
    margin: 0 auto;
  }
  .print-font-size {
    font-size: 12px !important;
  }
  .larger-print-font-size {
    font-size: 12px !important;
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
