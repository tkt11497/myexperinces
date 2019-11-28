<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      temporary
    >
      <v-list>
        <v-list-item to="/dashboard/profile" router exact>
          <v-list-item-action>
            <v-icon>person</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user[0].name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item to="/dashboard" router exact>
          <v-list-item-action>
            <v-icon>memory</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Dashboard'" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list v-for="(item, index) in items" :key="index">
        <!-- <v-list-item avatar>
          <v-list-item-action>
            <v-icon>{{ item.header.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.header.name" />
          </v-list-item-content>
        </v-list-item>-->
        <v-list>
          <v-list-item v-for="(item, index) in item.items" :key="index" :to="item.to" router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed color="#283E4A" dark app class="no-print">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <!-- <Back class="no-print"></Back> -->

      <!-- <v-flex xs8 class="title">
          <span>{{ title }}</span>
      </v-flex>-->
      <v-toolbar-title style="color:white" v-text="title" />
      <v-spacer />
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Back from "@/components/App/Back.vue";
import { mapGetters } from "vuex";

export default {
  components: { Back },
  data() {
    return {
      rightDrawer: false,
      right: true,
      fixed: false,
      clipped: false,
      miniVariant: false,
      drawer: false,
      items: [
        // {
        // header: { name: "Operation", icon: "departure_board" },
        // items: [{ name: "Pick Up", to: "/pickups", icon: "departure_board" }]
        // },
        // {
        //   header: { name: "Dashboard", icon: "memory" },
        //   items: [{ name: "Dashboard", to: "/dashboard", icon: "memory" }]
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
              name: "Total Parcels",
              to: "/dashboard/total_parcels",
              icon: "work"
            },
            { name:"Return", to:"/return_sheet", icon:"mdi-undo"},
            { name:"Finance", to:"/merchant_sheet", icon:"screen_share"},
          
            // {
            //   name: "Delivering Parcles",
            //   to: "/dashboard/delivering_vouchers",
            //   icon: "assignment"
            // },
            // {
            //   name: "Can't Deliver Parcles",
            //   to: "/dashboard/cant_deliver_vouchers",
            //   icon: "assignment"
            // },
            // {
            //   name: "Delivered Parcles",
            //   to: "/dashboard/delivered_vouchers",
            //   icon: "assignment"
            // },
            // {
            //   name: "Parcles To Be Paid",
            //   to: "/dashboard/vouchers_to_be_paid",
            //   icon: "assignment"
            // },
            // {
            //   name: "Paid Parcles",
            //   to: "/dashboard/paid_vouchers",
            //   icon: "assignment"
            // },
            // {
            //   name: "Return Parcles",
            //   to: "/dashboard/return_vouchers",
            //   icon: "assignment"
            // },
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
