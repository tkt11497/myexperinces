<template>
  <div></div>
</template>

<script>
export default {
  middleware: ["checkAuth"],
  layout: "clean",
  created() {
    this.$router.push("/login");
  }
};
</script>
