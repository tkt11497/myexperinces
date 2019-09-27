<template>
  <div>logout</div>
</template>

<script>
import localforage from "localforage";

export default {
  async mounted() {
    await localforage.clear();
    this.$router.push("/login");
  }
};
</script>
