<template>
  <div>
    <v-layout v-for="(parcel, pIndex) in voucher.parcels" :key="pIndex">
      <v-flex xs12>
        <v-layout justify-end mt-2>
          <v-flex xs1 class="cell">Item</v-flex>
          <v-flex xs1 class="cell">Quantity</v-flex>
          <v-flex xs1 class="cell">Price</v-flex>
          <v-flex xs1 class="cell">
            <button
              :disabled="voucher.is_closed"
              class="green--text"
              @click="addNewItem({ parcel })"
            >
              <v-icon :color="getColor('add')">add</v-icon>
            </button>
          </v-flex>
        </v-layout>
        <v-layout v-for="(item, iIndex) in parcel.parcel_items" :key="iIndex" justify-end>
          <v-layout justify-end v-if="item.isLocked">
            <!-- show locked item row -->
            <v-flex xs1>
              <button class="cell-button" @click="onUnlockItem({ item })">{{ item.item_name }}</button>
            </v-flex>
            <v-flex xs1>
              <button class="cell-button" @click="onUnlockItem({ item })">{{ item.item_qty }}</button>
            </v-flex>
            <v-flex xs1>
              <button class="cell-button" @click="onUnlockItem({ item })">{{ item.item_price }}</button>
            </v-flex>
            <v-flex xs1>
              <button
                :disabled="voucher.is_closed"
                class="cell-button red--text"
                @click="onDelItem({ parcel, item, iIndex })"
              >
                <v-icon :color="getColor('del')">delete</v-icon>
              </button>
            </v-flex>
          </v-layout>
          <v-layout justify-end v-else>
            <v-flex xs1 class="cell">
              <v-text-field
                browser-autocomplete="off"
                :disabled="voucher.is_closed"
                v-model="item.item_name"
              ></v-text-field>
            </v-flex>
            <v-flex xs1 class="cell">
              <v-text-field
                browser-autocomplete="off"
                :disabled="voucher.is_closed"
                v-model="item.item_qty"
              ></v-text-field>
            </v-flex>
            <v-flex xs1 class="cell">
              <v-text-field
                browser-autocomplete="off"
                :disabled="voucher.is_closed"
                v-model="item.item_price"
              ></v-text-field>
            </v-flex>
            <v-flex xs1 class="cell" flat>
              <button
                :disabled="voucher.is_closed"
                style="height: 100%; width: 100%;"
                @click="onDelItem({ parcel, item, iIndex })"
              >
                <v-icon :color="getColor('del')">delete</v-icon>
              </button>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout justify-end mt-2>
          <v-flex xs1 class="cell">CBM</v-flex>
          <v-flex xs1 class="cell">Weight</v-flex>
          <v-flex xs1 class="cell">Delivery</v-flex>
          <v-flex v-if="voucher.bus_station" xs1 class="cell">Bus Fee</v-flex>
          <v-flex xs1 class="cell">Coupon</v-flex>
          <v-flex xs1 class="cell">Discount</v-flex>
          <v-flex xs1 class="cell">Subtotal</v-flex>
          <v-flex xs1 class="cell">Actions</v-flex>
        </v-layout>
        <v-layout justify-end v-if="parcel.isLocked">
          <!-- show locked parcel row -->
          <v-flex xs1>
            <button
              class="cell-button"
              @click="onUnlockParcel({ parcel })"
            >{{ getGlobalScaleDescription(parcel.global_scale) }}</button>
          </v-flex>
          <v-flex xs1>
            <button class="cell-button" @click="onUnlockParcel({ parcel })">{{ parcel.weight }}</button>
          </v-flex>
          <v-flex xs1>
            <button
              class="cell-button"
              @click="onUnlockParcel({ parcel })"
            >{{ parcel.cal_delivery_price }}</button>
          </v-flex>
          <v-flex xs1 v-if="voucher.bus_station">
            <button
              class="cell-button"
              @click="onUnlockParcel({ parcel })"
            >{{ parcel.cal_gate_price }}</button>
          </v-flex>
          <v-flex xs1>
            <button
              class="cell-button"
              @click="onUnlockParcel({ parcel })"
            >{{ parcel.coupon.code || "empty" }}</button>
          </v-flex>
          <v-flex xs1>
            <button
              class="cell-button"
              @click="onUnlockParcel({ parcel })"
            >{{ parcel.discount_amount || parcel.coupon_price }}</button>
          </v-flex>
          <v-flex xs1>
            <button class="cell-button" @click="onUnlockParcel({ parcel })">{{ parcel.sub_total }}</button>
          </v-flex>
          <v-flex xs1>
            <button
              :disabled="voucher.is_closed"
              class="cell-button"
              @click="onDelParcel({ parcels: voucher.parcels, parcel, pIndex })"
            >
              <v-icon :color="getColor('del')">delete</v-icon>
            </button>
          </v-flex>
        </v-layout>

        <v-layout justify-end v-else>
          <v-flex xs1 class="cell">
            <v-autocomplete
              :disabled="voucher.is_closed"
              :items="globalScales"
              item-text="description"
              item-value="id"
              v-model="parcel.global_scale"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs1 class="cell">
            <v-text-field
              browser-autocomplete="off"
              :disabled="voucher.is_closed"
              type="number"
              :max="parcel.maxWeight"
              v-model="parcel.weight"
            ></v-text-field>
          </v-flex>
          <v-flex xs1 class="cell">
            <v-text-field browser-autocomplete="off" :value="parcel.cal_delivery_price" disabled></v-text-field>
          </v-flex>
          <v-flex xs1 class="cell" v-if="voucher.bus_station">
            <v-text-field browser-autocomplete="off" :value="parcel.cal_gate_price" disabled></v-text-field>
          </v-flex>
          <v-flex xs1 class="cell">
            <form @submit.prevent="checkValidCoupon(parcel)">
              <v-text-field browser-autocomplete="off" :disabled="true" v-model="parcel.tempCoupon"></v-text-field>
            </form>
          </v-flex>
          <v-flex xs1 class="cell">
            <v-text-field browser-autocomplete="off" :value="parcel.discount_amount" disabled></v-text-field>
          </v-flex>
          <v-flex xs1 class="cell">
            <v-text-field browser-autocomplete="off" :value="parcel.amount_to_collect" disabled></v-text-field>
          </v-flex>
          <v-flex xs1 class="cell red--text">
            <button
              style="width: 100%; height: 100%"
              @click="onDelParcel({ parcels: voucher.parcels, parcel, pIndex })"
            >DEL</button>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { getId } from "@/assets/utilities/helpers/common";

export default {
  props: {
    voucher: Object,
    globalScales: Array
  },
  methods: {
    getGlobalScaleDescription(globalScale) {
      const scaleId = getId(globalScale);
      return this.globalScales.find(({ id }) => id === scaleId).description;
    },
    getColor(mode) {
      if (mode === "del") return this.voucher.is_closed ? "grey" : "red";
      else if (mode === "add") return this.voucher.is_closed ? "grey" : "green";
    },
    checkValidCoupon(parcel) {
      this.$emit("checkValidCoupon", parcel);
    },
    addNewItem({ parcel }) {
      this.$emit("addNewItem", { parcel });
    },
    onDelItem({ parcel, item, iIndex }) {
      this.$emit("onDelItem", { parcel, item, iIndex });
    },
    onDelParcel({ parcels, parcel, pIndex }) {
      this.$emit("onDelParcel", { parcels, parcel, pIndex });
    },
    onUnlockParcel({ parcel }) {
      this.$emit("onUnlockParcel", { parcel });
    },
    onUnlockItem({ item }) {
      this.$emit("onUnlockItem", { item });
    }
  }
};
</script>
