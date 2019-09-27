<template>
  <!-- @click="$router.go(-1)" -->
  <div>
    <v-btn
      v-show="show"
      color="primary lighten-1"
      flat
      @click="url != 'history' ? $router.push(url) : $router.go(-1)"
    >
      <v-icon>keyboard_arrow_left</v-icon>Back
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      show: "navigation/show",
      url: "navigation/url"
    })
  }
};
</script>
