<template>
  <div>
    <!-- <v-layout row wrap mt-5 pt-5> -->
    <!-- <v-flex xs12 md4></v-flex> -->
    <!-- <v-flex xs12 md4>
        <v-card>
          <form @submit.prevent="logIn">
            <v-card-title primary-title>
              <h4 class="display-1">Login</h4>
            </v-card-title>
            <v-card-text>
              <v-text-field
                browser-autocomplete="off"
                label="User Name"
                v-model="userName"
                type="'text'"
                name="userName"
                v-validate="'required'"
                :error="!!errors.first('userName')"
                :error-messages="errors.first('userName')"
              ></v-text-field>
              <v-text-field
                browser-autocomplete="off"
                name="password"
                label="Enter your password"
                :append-icon="
                  isPasswordHidden ? 'visibility' : 'visibility_off'
                "
                @click:append="() => (isPasswordHidden = !isPasswordHidden)"
                v-model="password"
                :type="isPasswordHidden ? 'password' : 'text'"
                v-validate="'required'"
                :error="!!errors.first('password')"
                :error-messages="errors.first('password')"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <span class="red--text" v-if="!!errorMessage">{{
                errorMessage
              }}</span>
              <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="green"
              ></v-progress-circular>
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                full-width
                color="primary"
                type="submit"
                :disabled="isLoginDisabled"
                >Log In</v-btn
              >
            </v-card-actions>
          </form>
        </v-card>
    </v-flex>-->
    <v-layout row wrap mt-5>
      <v-flex xs12>
        <v-app id="inspire">
          <v-content>
            <v-container fluid mt-5>
              <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                    <form @submit.prevent="logIn" @keyup.enter="logIn">
                      <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-chip color="teal" class="ml-0" small>2-9-2019</v-chip>
                      </v-toolbar>
                      <v-card-text>
                        <v-form>
                          <v-text-field
                            browser-autocomplete="off"
                            prepend-icon="person"
                            v-model="userName"
                            name="userName"
                            label="Login"
                            type="text"
                            v-validate="'required'"
                            :error="!!errors.first('userName')"
                            :error-messages="errors.first('userName')"
                          ></v-text-field>
                          <v-text-field
                            browser-autocomplete="off"
                            id="password"
                            prepend-icon="lock"
                            name="password"
                            label="Password"
                            :append-icon="
                              isPasswordHidden ? 'visibility' : 'visibility_off'
                            "
                            @click:append="
                              () => (isPasswordHidden = !isPasswordHidden)
                            "
                            v-model="password"
                            :type="isPasswordHidden ? 'password' : 'text'"
                            v-validate="'required'"
                            :error="!!errors.first('password')"
                            :error-messages="errors.first('password')"
                          ></v-text-field>
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-card-text>
                          <span class="red--text" v-if="!!errorMessage">
                            {{
                            errorMessage
                            }}
                          </span>
                          <v-progress-circular v-if="isLoading" indeterminate color="green"></v-progress-circular>
                        </v-card-text>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" :disabled="isLoginDisabled" type="submit">Login</v-btn>
                      </v-card-actions>
                    </form>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-content>
        </v-app>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" bottom left :timeout="timeout">
      {{ errorMessage }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <!-- </v-layout> -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import api from "@/assets/utilities/api/index.js";
import { mapPaymentTypes } from "@/assets/utilities/helpers/paymentTypes.js";
import localforage from "localforage";

export default {
  layout: "clean",
  async asyncData(context) {
    const existingJwt = await localforage.getItem("jwt");
    if (existingJwt) context.redirect("/dashboard");
    return {};
  },
  data() {
    return {
      snackbar: false,
      userName: "",
      password: "",
      isPasswordHidden: true,
      isErrorUserName: false,
      isErrorPassword: false,
      errorMessage: "",
      timeout: 3000,
      isLoading: false
    };
  },
  computed: {
    isLoginDisabled() {
      if (!this.userName || !this.password) return true;
    }
  },
  methods: {
    ...mapActions({
      setUser: "auth/setUser",
      setJwt: "auth/setJwt"
    }),
    async logIn() {
      const { userName, password } = this;
      this.isErrorUserName = !userName;
      this.isErrorPassword = !password;
      this.isLoading = true;
      this.errorMessage = "";
      if (!userName || !password) return;
      const { $axios } = this;
      try {
        const response = await api.postLogin($axios, null, {
          username: userName,
          password
        });
        if (response.status === 1) {
          const jwt = response.data.access_token;
          console.log("TCL: logIn -> jwt", jwt);
          this.setJwt(jwt);
          this.setUser(response.data.user);
          await localforage.setItem("jwt", jwt);
          await localforage.setItem("user", response.data.user);
          const responses = await Promise.all([
            api.getMerchants($axios, jwt), // 0
            api.getStaffs($axios, jwt), // 1
            api.getCities($axios, jwt), // 2
            api.getZones($axios, jwt), // 3
            api.getPaymentTypes($axios, jwt), // 4
            api.getBusStations($axios, jwt), // 5
            api.getDeliveryStatuses($axios, jwt), // 6
            api.getMetas($axios, jwt), // 7
            api.getGlobalScales($axios, jwt), // 8
            api.getGates($axios, jwt), // 9,
            api.getDeliveryStatuses($axios, jwt), //10
            api.getCallStatuses($axios, jwt), //11
            api.getStoreStatuses($axios, jwt), //12
            api.getLogStatuses($axios, jwt), // 13
            api.getDelegateDurations($axios, jwt) // 14
            // api.getBuses($axios, jwt) //15
          ]);
          responses.forEach(({ status }) => {
            if (status === 1) return;
          });
          const mappedPaymentTypes = mapPaymentTypes(responses[4].data);
          await Promise.all([
            localforage.setItem("stored:merchants", responses[0].data),
            localforage.setItem("stored:staffs", responses[1].data),
            localforage.setItem("stored:cities", responses[2].data),
            localforage.setItem("stored:zones", responses[3].data),
            localforage.setItem("stored:paymentTypes", mappedPaymentTypes),
            localforage.setItem("stored:busStations", responses[5].data),
            localforage.setItem("stored:deliveryStatuses", responses[6].data),
            localforage.setItem("stored:metas", responses[7].data),
            localforage.setItem("stored:globalScales", responses[8].data),
            localforage.setItem("stored:gates", responses[9].data),
            localforage.setItem("stored:callStatuses", responses[11].data),
            localforage.setItem("stored:storeStatuses", responses[12].data),
            localforage.setItem("stored:logStatuses", responses[13].data),
            localforage.setItem("stored:delegateDurations", responses[14].data)
            // localforage.setItem("stored:buses", responses[15].data),
            // localforage.setItem("stored:routes", responses[16].data),
            // localforage.setItem("stored:courierType", responses[17].data),
            // localforage.setItem("stored:paymentStatuses", responses[19].data),
            // localforage.setItem("stored:trackingStatuses", responses[20].data),
            // localforage.setItem("stored:doorToDoors", responses[21].data),
            // localforage.setItem("stored:busDropOffs", responses[22].data),
            // localforage.setItem("stored:staffs", responses[23].data),
            // localforage.setItem("stored:departments", responses[24].data),
            // localforage.setItem("stored:agents", responses[25].data)
          ]);
          this.$router.push("/pickups");
        }
        if (response.status === 2) {
          this.errorMessage = response.message;
          this.snackbar = true;
          this.isLoading = false;
        }
      } catch (error) {
        console.log("TCL: logIn -> error", error);
        this.errorMessage = "Something Wrong";
        this.snackbar = true;
        this.isLoading = false;
      }
    }
  }
};
</script>
