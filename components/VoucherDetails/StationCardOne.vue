<template>
  <v-card>
    <!-- To City -->
    <v-layout px-3 pt-1>
      <v-autocomplete
        :disabled="voucher.is_closed"
        :items="getStationReceiverCities()"
        label="Receiver City"
        v-model="voucher.receiver_city"
        :error="!voucher.receiver_city"
        item-text="name"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
    <v-layout px-3 pt-1>
      <!-- From Station -->
      <v-autocomplete
        :disabled="voucher.is_closed"
        label="Sender Bus Station"
        :items="getSenderStations()"
        v-model="voucher.sender_bus_station"
        :error="!voucher.sender_bus_station"
        item-text="name"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
    <!-- To Station -->
    <v-layout px-3 pt-1>
      <v-autocomplete
        :disabled="voucher.is_closed"
        :items="getReceiverStations()"
        label="Receiver Bus Station"
        v-model="voucher.receiver_bus_station"
        :error="!voucher.receiver_bus_station"
        item-text="name"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
    <!-- Bus -->
    <v-layout px-3 pt-1>
      <v-autocomplete
        :disabled="voucher.is_closed"
        :items="getSenderGates()"
        label="Gate"
        v-model="voucher.sender_gate"
        :error="!voucher.sender_gate"
        item-text="name"
        item-value="id"
      ></v-autocomplete>
    </v-layout>
  </v-card>
</template>

<script>
import _ from "lodash";
import { getId } from "@/assets/utilities/helpers/common";

export default {
  props: {
    voucher: Object,
    metas: Array,
    cities: Array,
    stations: Array,
    gates: Array
  },
  methods: {
    getCurrentCityId() {
      return parseInt(this.metas.find(({ key }) => key === "city").value, 10);
    },
    getStationReceiverCities() {
      const currentCityId = this.getCurrentCityId();
      return this.cities.filter(city => city.id !== currentCityId);
    },
    getSenderStations() {
      return this.stations.filter(
        station => station.city.id === this.getCurrentCityId()
      );
    },
    getReceiverStations() {
      return this.stations.filter(
        station => station.city.id === getId(this.voucher.receiver_city)
      );
    },
    getReceiverGates() {
      const senderStationId = getId(this.voucher.sender_bus_station);
      const receiverStationId = getId(this.voucher.receiver_bus_station);
      if (!senderStationId || !receiverStationId) return [];
      const senderGates = this.stations.find(
        station => station.id === senderStationId
      ).gates;
      const receiverGates = this.stations.find(
        station => station.id === receiverStationId
      ).gates;
      return _.intersectionBy(senderGates, receiverGates, "bus.id");
    },
    getSenderGates() {
      const senderStationId = getId(this.voucher.sender_bus_station);
      const receiverStationId = getId(this.voucher.receiver_bus_station);
      if (!senderStationId || !receiverStationId) return [];
      const senderGates = this.stations.find(
        station => station.id === senderStationId
      ).gates;
      const receiverGates = this.stations.find(
        station => station.id === receiverStationId
      ).gates;
      return _.intersectionBy(senderGates, receiverGates, "bus.id");
    }
  }
};
</script>
