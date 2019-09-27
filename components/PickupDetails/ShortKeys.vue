<template>
  <div>
    <!-- <div @shortkey="createNewBusStationVoucher" v-shortkey="['ctrl', '2']"></div> -->
    <div @shortkey="createNewNormalVoucher" v-shortkey="['ctrl', '1']"></div>
    <div @shortkey="onSubmit" v-shortkey="['ctrl', 's']"></div>
    <div @shortkey="$router.go(-1)" v-shortkey="['ctrl', 'b']"></div>
    <div @shortkey="nextRow" v-shortkey="['ctrl', 'arrowdown']"></div>
    <div @shortkey="previousRow" v-shortkey="['ctrl', 'arrowup']"></div>
    <div @shortkey="onUnlockRow" v-shortkey="['ctrl', 'e']"></div>
    <div @shortkey="onDelRow" v-shortkey="['ctrl', 'd']"></div>
  </div>
</template>

<script>
export default {
  methods: {
    createNewBusStationVoucher() {
      this.$emit("createNewBusStationVoucher");
    },
    createNewNormalVoucher() {
      this.$emit("createNewNormalVoucher");
    },
    onSubmit() {
      this.$emit("onSubmit");
    },
    nextRow() {
      this.$emit("nextRow");
    },
    previousRow() {
      this.$emit("previousRow");
    },
    onUnlockRow() {
      this.$emit("onUnlockRow");
    },
    onDelRow() {
      this.$emit("onDelRow");
    }
  }
};
</script>
