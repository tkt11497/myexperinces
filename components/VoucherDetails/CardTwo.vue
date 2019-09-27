<template>
  <v-card>
    <v-layout px-3 pt-1 v-if="voucher.bus_station === 1">
      <v-text-field label="Bus Debit" :value="getGateDebitStatus()" disabled></v-text-field>
    </v-layout>
    <v-layout px-3 pt-1>
      <v-autocomplete
        label="Call status"
        :items="callStatuses"
        v-model="voucher.call_status"
        item-text="status_mm"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
    <v-layout px-3 pt-1>
      <v-autocomplete
        label="Store status"
        :items="getStoreStatuses()"
        v-model="voucher.store_status"
        item-text="status_mm"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
    <v-layout px-3 pt-1>
      <v-autocomplete
        label="Delegate"
        :disabled="getId(voucher.call_status) === 3"
        :items="customerDutyStaffs"
        v-model="voucher.delegate_person"
        item-text="username"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
    <v-layout px-3 pt-1>
      <v-autocomplete
        label="Postpone"
        :disabled="getId(voucher.delegate_duration) === 3"
        v-model="voucher.delegate_duration"
        :items="delegateDurations"
        item-text="name"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
  </v-card>
</template>

<script>
import { getId } from "@/assets/utilities/helpers/common";

export default {
  props: {
    voucher: Object,
    customerDutyStaffs: Array,
    delegateDurations: Array,
    callStatuses: Array,
    storeStatuses: Array,
    gates: Array
  },
  methods: {
    getId(status) {
      return getId(status);
    },
    getGateDebitStatus() {
      const receiverGateId = getId(this.voucher.receiver_gate);
      if (!receiverGateId) return "";
      const foundGate = this.gates.find(({ id }) => id === receiverGateId);
      if (!foundGate.gate_debit) return "Debit Unavailable";
      else return "Debit  Available";
    },
    getStoreStatuses() {
      return this.storeStatuses.filter(({ id }) => id === 1 || id === 2);
    }
  }
};
</script>
