<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 offset-md1 md2 offset-xs1>
        <v-layout align-center row wrap>
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="date"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
            @input="onChangeDate"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                autocomplete="off"
                v-model="date"
                label="Pick Date"
                prepend-icon="event"
                readonly
                v-on="on"
                class="pr-1 mr-1"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-col md11 offset-md="1">
      <v-layout row wrap class="ml-4">
        <v-flex xs12 sm8 md3 class="ma-2">
        
          <material-stats-card
            color="primary"
            icon="mdi-truck"
            :value="`${total_pickups_count} pickups`"
            title="Pickups"
            sub-icon="mdi-calendar"
            :sub-text="total"
          />
        
        </v-flex>
        <v-flex xs12 sm8 md3 class="ma-2">
         
          <material-stats-card
            color="orange"
            icon="work"
            :value="`${total_vouchers_count} Parcels`"
            title="Total Parcels"
            sub-icon="mdi-calendar"
            :sub-text="total"
          />
          
        </v-flex>
        <v-flex xs12 sm8 md3 class="ma-2">
         
          <material-stats-card
            color="teal"
            icon="flight_takeoff"
            :value="`${total_delivering_vouchers} Parcels`"
            title="Delivering"
            smallValue="Parcels"
            sub-icon="mdi-calendar"
            sub-text="total"
          />
        </v-flex>
        <v-flex xs12 sm8 md3 class="ma-2">
          <material-stats-card
            color="green"
            icon="mdi-airplane"
            :value="`${total_delivered_vouchers} Parcels`"
            title="Delivered" 
            smallValue="Parcels"
            sub-icon="mdi-calendar"
            sub-text="total"
          />
        </v-flex>
        <v-flex xs12 sm8 md3 class="ma-2">
          <material-stats-card
            color="purple"
            icon="flight_land"
            title="Can't Deliver"
            smallValue="Parcels"
            :value="`${total_not_delivered_vouchers} Parcels`"
            sub-icon="mdi-calendar"
            sub-text="total"
          />
        </v-flex>
         <v-flex xs12 sm8 md3 class="ma-2">
          <material-stats-card
            color="red"
            icon="mdi-undo"
            title="Return"
            smallValue="Parcels"
            :value="`${total_returned_vouchers} Parcels Received / ${total_return_vouchers} Pending`"
            sub-icon="mdi-calendar"
            sub-text="total"
          />
        </v-flex>
              <v-flex xs12 sm8 md3 class="ma-2">
          <material-stats-card
            color="#002C6D"
            icon="screen_share"
            title="Parcels Tobe Paid"
            :value="`${total_merchant_sheetVouchers} Parcels `"
            sub-icon="mdi-calendar"
            sub-text="total"
          />
        </v-flex>
              <v-flex xs12 sm8 md3 class="ma-2">
          <material-stats-card
            color="#002C6D"
            icon="cloud_done"
            title="Paid"
            smallValue="Parcels"
            :value="`${total_merchant_sheet_paid_vouchers} Parcels `"
            sub-icon="mdi-calendar"
            sub-text="total"
          />
        </v-flex>
      </v-layout>
    </v-col>
  </v-container>
</template>
<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
<script>
import { mapGetters } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
export default {
  middleware: ["auth"],
  data() {
    return {
      date: null,
      total:"Total",
      dateMenu: false,
      timer: true
    };
  },
  created() {
    setTimeout(() => {
      this.timer = false;
    }, 2000);
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "user"
    })
  },
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios, $api } = context.app;

    const data = await $api.getDashboard(
      $axios,
      jwt,
      new Date().toISOString().substr(0, 10)
    );
    if (!handleStatusInAsyncData({ status: data.status, context })) return;

    context.store.commit("title/setTitle", "Dashboard");

    // context.redirect("/pickups");
    console.log(data);
    return {
      ...data
    };
  },
  methods: {
    async onChangeDate() {
      if (!event) {
        const data = await this.$api.getDashboard_bydate(
          this.$axios,
          this.jwt,
          this.date
        );
        (this.total_pickups_count = data.total_pickups_count),
          (this.total_vouchers_count = data.total_vouchers_count),
          (this.total_dtd_vouchers_count = data.total_dtd_vouchers_count),
          (this.total_waybill_vouchers_count =
            data.total_waybill_vouchers_count);
            this.total=this.date
      }
    }
  }
};
</script>
