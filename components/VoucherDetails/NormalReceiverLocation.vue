<template>
  <div>
    <v-card>
      <v-layout px-3 pt-1>
        <v-autocomplete
          label="To City"
          :disabled="voucher.is_closed"
          :items="cities"
          v-model="voucher.receiver_city"
          item-value="id"
          item-text="name"
        ></v-autocomplete>
      </v-layout>

      <v-layout px-3 pt-1>
        <v-autocomplete
          label="To Zone"
          :disabled="voucher.is_closed"
          :items="getReceiverZones()"
          v-model="voucher.receiver_zone"
          item-value="id"
          item-text="name"
        ></v-autocomplete>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { getId } from "@/assets/utilities/helpers/common";
import { getZoneNames } from "@/assets/utilities/helpers/voucherDetails";
export default {
  props: {
    cities: Array,
    voucher: Object
  },
  methods: {
    getReceiverZones() {
      console.log(this.voucher);
      try {
        return this.cities.find(
          ({ id }) => id === getId(this.voucher.receiver_city)
        ).zones;
      } catch (error) {
        console.log("TCL: getReceiverZones -> error", error);
        return [];
      }
    }
  }
};
</script>
