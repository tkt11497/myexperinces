<template>
  <v-card>
    <v-layout px-3 pt-1>
      <v-text-field label="Sender" :value="getSenderName()" disabled></v-text-field>
    </v-layout>
    <v-layout px-3>
      <v-text-field label="Phone" :value="getSenderPhone()" disabled></v-text-field>
    </v-layout>
    <v-layout px-3>
      <v-text-field label="Address" id="id" :value="getSenderAddress()" disabled></v-text-field>
    </v-layout>
    <v-layout px-3 pb-1>
      <v-text-field label="Pickup By" id="id" :value="getOpenedBy()" disabled></v-text-field>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    pickup: Object
  },
  methods: {
    getSenderName() {
      return this.pickup.sender.name;
    },
    getSenderPhone() {
      if (this.pickup.sender_type === "Merchant") {
        return this.pickup.sender_associate.phones.join(", ");
      }
      return this.pickup.sender.phone;
    },
    getSenderAddress() {
      if (this.pickup.sender_type === "Merchant") {
        return this.pickup.sender_associate.address;
      }
      return this.pickup.sender.address;
    },
    getOpenedBy() {
      return this.pickup.opened_by
        ? this.pickup.opened_by.username
        : "--Empty--";
    }
  }
};
</script>
