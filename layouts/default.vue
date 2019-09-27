<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" absolute temporary style="height: 100vh">
      <v-list>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user[0].name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list v-for="(item, index) in items" :key="index">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>{{ item.header.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.header.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list class="ml-5">
            <v-list-tile
              avatar
              v-for="(item, index) in item.items"
              :key="index"
              @click="go(item.to)"
            >
              <v-list-tile-avatar>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider>
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <v-layout row align-center>
        <v-flex xs1>
          <v-layout row align-center>
            <button @click="triggerDrawer" style="padding: 20px" class="no-print">
              <v-icon large>format_indent_increase</v-icon>
            </button>
            <Back class="no-print"></Back>
          </v-layout>
        </v-flex>

        <!-- <v-flex xs8 class="title">
          <span>{{ title }}</span>
        </v-flex>-->
        <v-flex xs10 text-xs-center>
          <h1 class="display-1 font-weight-black no-print">{{ title }}</h1>
        </v-flex>
      </v-layout>

      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import Back from "@/components/App/Back.vue";
import { mapGetters } from "vuex";

export default {
  components: { Back },
  data() {
    return {
      drawer: false,
      items: [
        // {
        // header: { name: "Operation", icon: "departure_board" },
        // items: [{ name: "Pick Up", to: "/pickups", icon: "departure_board" }]
        // },
        {
          header: { name: "General", icon: "memory" },
          items: [
            // {
            //   name: "Universal Vouchers",
            //   to: "/dashboard/universal_voucher_sheet",
            //   icon: "assignment"
            // },
            { name: "Pick Up", to: "/pickups", icon: "departure_board" },
            {
              name: "Pickups List",
              to: "/dashboard/universal_pickup_sheet",
              icon: "assignment"
            },
            { name: "Log Out", to: "/dashboard/log_out", icon: "exit_to_app" }
          ]
        }
        // {
        // header: { name: "User", icon: "person" },
        // items: [
        //   { name: "Log Out", to: "/dashboard/log_out", icon: "exit_to_app" }
        // ]
        // }
      ]
    };
  },
  computed: {
    ...mapGetters({
      title: "title/title",
      user: "auth/user"
    })
  },
  methods: {
    go(to) {
      this.$router.push(to);
    },
    triggerDrawer() {
      this.drawer = !this.drawer;
    }
  }
};
</script>

<style>
.show {
  opacity: 1;
}
.hide {
  opacity: 0;
}
.row-active {
  background-color: rgb(202, 230, 255);
  height: 100%;
}
.row-button {
  outline: none;
}
.cell {
  border: 1px #adadad solid;
  padding: 2px;
  text-align: center;
  flex: 1;
}
.cell-button {
  height: 100%;
  display: inline-block;
  overflow: auto;
  width: 100%;
  outline: none;
  border: 1px #adadad solid;
  padding: 2px;
  text-align: center;
}
@media print {
  .no-print {
    display: none;
  }
}
</style>
