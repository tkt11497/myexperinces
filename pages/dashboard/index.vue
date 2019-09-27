<template>
  <div>dashboard</div>
</template>

<script>
export default {
  asyncData(context) {
    context.redirect("/pickups");
  }
};
</script>
