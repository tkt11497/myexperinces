<template>
  <v-card>
    <v-layout px-3 pt-1>
      <v-text-field
        browser-autocomplete="off"
        
        name="receiverName"
        label="Receiver"
        v-model="voucher.receiver.name"
        :error="!voucher.receiver.name"
      ></v-text-field>
    </v-layout>
    <v-layout px-3>
      <v-text-field
        browser-autocomplete="off"
        
        name="receiverPhone"
        label="Primary Phone"
        v-model="voucher.receiver.phone"
        :error="!voucher.receiver.phone"
        type="number"
        min="0"
        step="1"
      ></v-text-field>
    </v-layout>
    <v-layout px-3>
      <v-text-field
        browser-autocomplete="off"
        
        name="receiverSecondaryPhone"
        label="Secondary Phone"
        v-model="voucher.receiver.other_phone"
        type="number"
        min="0"
        step="1"
      ></v-text-field>
    </v-layout>
    <v-layout px-3 pb-1>
      <v-text-field
        browser-autocomplete="off"
        
        name="address"
        label="Address"
        v-model="voucher.receiver.address"
        :error="voucher.bus_station === 0 ? !voucher.receiver.address : null"
      ></v-text-field>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  props: {
    voucher: Object
  }
};
</script>
