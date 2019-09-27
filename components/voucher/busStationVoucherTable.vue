<template>
  <div>
    <v-layout row wrap mx-3 my-3>
      <h6 class="title">Bus Station Vouchers</h6>
    </v-layout>
    <v-layout row wrap>
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Voucher ID</v-flex
      >
      <v-flex text-xs-center xs1 class="cell font-weight-bold">Customer</v-flex>
      <v-flex text-xs-center xs1 class="cell font-weight-bold">Phone</v-flex>
      <v-flex text-xs-center xs1 class="cell font-weight-bold">Address</v-flex>
      <v-flex text-xs-center xs2 class="cell font-weight-bold">Depart</v-flex>
      <v-flex text-xs-center xs2 class="cell font-weight-bold">Arrive</v-flex>
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Item Price</v-flex
      >
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Payment Status</v-flex
      >
      <v-flex text-xs-center xs1 v-if="sender_type === 'Merchant'">
        <v-layout>
          <v-flex text-xs-center xs6 class="cell font-weight-bold"
            >Bus Fee</v-flex
          >
          <v-flex text-xs-center xs6 class="cell font-weight-bold"
            >Deposit</v-flex
          >
        </v-layout>
      </v-flex>
      <v-flex xs1 text-xs-center v-else class="cell font-weight-bold"
        >Bus Fee</v-flex
      >
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Amount To Collect</v-flex
      >
    </v-layout>
    <v-layout v-show="stationForms.length === 0">
      <v-flex class="cell font-weight-bold" xs12 text-xs-center
        >--- Empty --</v-flex
      >
    </v-layout>
    <div v-for="(form, index) in stationForms" :key="index">
      <button
        v-if="form.isLocked"
        :ref="'station-' + index + '-lockedRow'"
        :name="'station-' + index + '-lockedRow'"
        style="width: 100%"
      >
        <v-layout>
          <AppCell>{{ form.voucherId }}</AppCell>
          <AppCell>{{ form.customerName }}</AppCell>
          <AppCell>{{ form.customerPhone }}</AppCell>
          <AppCell>{{ form.customerAddress }}</AppCell>
          <v-flex class="cell" xs2>{{
            `${form.departBusStation} - ${form.departGate}`
          }}</v-flex>
          <v-flex class="cell" xs2>{{
            `${form.arriveBusStation} - ${form.arriveGate}`
          }}</v-flex>
          <AppCell>{{ form.itemPrice }}</AppCell>
          <AppCell>{{ form.paymentStatus }}</AppCell>
          <AppCell v-if="sender_type === 'Merchant'">
            <v-layout style="height: 100%">
              <v-flex
                xs6
                style="height: 100%; border-right: 1px #ededed dotted"
                >{{ form.busFee }}</v-flex
              >
              <v-flex xs6>{{ form.deposit }}</v-flex>
            </v-layout>
          </AppCell>
          <AppCell v-else>{{ form.busFee }}</AppCell>
          <AppCell>{{ form.amountToCollect }}</AppCell>
        </v-layout>
      </button>

      <form v-else browser-autocomplete="off">
        <v-layout row wrap>
          <AppCell>
            <!-- customer -->
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-voucherId'"
              :name="'station-' + index + '-voucherId'"
              v-model="form.voucherId"
              disabled
              readonly
            ></v-text-field>
          </AppCell>
          <AppCell>
            <!-- customer -->
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-customerName'"
              :name="'station-' + index + '-customerName'"
              v-model="form.customerName"
            ></v-text-field>
          </AppCell>
          <AppCell>
            <!-- customercustomerPhone -->
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-customerPhone'"
              :name="'station-' + index + '-customerPhone'"
              v-model="form.customerPhone"
            ></v-text-field>
          </AppCell>
          <AppCell>
            <!-- customerAddress -->
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-customerAddress'"
              :name="'station-' + index + '-customerAddress'"
              v-model="form.customerAddress"
            ></v-text-field>
          </AppCell>
          <v-flex class="cell" xs2>
            <!-- depart -->
            <v-layout>
              <v-flex xs6>
                <v-autocomplete
                  :ref="'station-' + index + '-departBusStation'"
                  :name="'station-' + index + '-departBusStation'"
                  label="Bus Station"
                  v-model="form.departBusStation"
                  :items="busStationsValues"
                  @change="onChangeDepartBusStation(index)"
                  v-validate="'required'"
                  :error="!!errors.first('departBusStation')"
                  :error-messages="errors.first('departBusStation')"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :ref="'station-' + index + '-departGate'"
                  :name="'station-' + index + '-departGate'"
                  label="Gate"
                  v-model="form.departGate"
                  :items="getDepartGatesValues(form, index)"
                  v-validate="'required'"
                  :error="!!errors.first('departGate')"
                  :error-messages="errors.first('departGate')"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex class="cell" xs2>
            <!-- arrive -->
            <v-layout>
              <v-flex xs6>
                <v-autocomplete
                  :ref="'station-' + index + '-arriveBusStation'"
                  :name="'station-' + index + '-arriveBusStation'"
                  label="Bus Station"
                  v-model="form.arriveBusStation"
                  :items="busStationsValues"
                  @change="onChangeArriveBusStation(index)"
                  v-validate="'required'"
                  :error="!!errors.first('arriveBusStation')"
                  :error-messages="errors.first('arriveBusStation')"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :ref="'station-' + index + '-arriveGate'"
                  :name="'station-' + index + '-arriveGate'"
                  label="Gate"
                  v-model="form.arriveGate"
                  :items="getArriveGatesValues(form, index)"
                  v-validate="'required'"
                  :error="!!errors.first('arriveGate')"
                  :error-messages="errors.first('arriveGate')"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-flex>
          <AppCell>
            <!-- Item Price -->
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-itemPrice'"
              :name="'station-' + index + '-itemPrice'"
              v-model="form.itemPrice"
            ></v-text-field>
          </AppCell>
          <AppCell>
            <!-- Payment Type -->
            <v-autocomplete
              :ref="'station-' + index + '-paymentType'"
              :name="'station-' + index + '-paymentType'"
              v-model="form.paymentType"
              :items="filteredPaymentTypesValues"
              v-validate="'required'"
              :error="!!errors.first('paymentType')"
              :error-messages="errors.first('paymentType')"
            ></v-autocomplete>
          </AppCell>
          <v-flex xs1 v-if="sender_type === 'Merchant'">
            <v-layout>
              <v-flex xs6 class="cell">
                <v-text-field
                  browser-autocomplete="off"
                  :ref="'station-' + index + '-busFee'"
                  :name="'station-' + index + '-busFee'"
                  v-model="form.busFee"
                ></v-text-field>
              </v-flex>
              <v-flex xs6 class="cell">
                <v-text-field
                  browser-autocomplete="off"
                  :ref="'station-' + index + '-deposit'"
                  :name="'station-' + index + '-deposit'"
                  v-model="form.deposit"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs1 v-else class="cell">
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-busFee'"
              :name="'station-' + index + '-busFee'"
              v-model="form.busFee"
            ></v-text-field>
          </v-flex>
          <v-flex xs1 class="cell">
            <v-text-field
              browser-autocomplete="off"
              :ref="'station-' + index + '-amountToCollect'"
              :name="'station-' + index + '-amountToCollect'"
              v-model="form.amountToCollect"
              disabled
              readonly
            ></v-text-field>
          </v-flex>
        </v-layout>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stationForms: { type: Array, required: true },
    busStationsValues: { type: Array, required: true },
    busStations: { type: Array, required: true },
    paymentTypesValues: { type: Array, required: true },
    sender_type: { type: String, required: true }
  },
  computed: {
    filteredPaymentTypesValues() {
      if (this.sender_type === "Customer") return [this.paymentTypesValues[2]];
      return this.paymentTypesValues;
    }
  },
  methods: {
    getDepartGatesValues(form, index) {
      const foundDepartBusStation = this.busStations.find(
        ({ name }) => name === form.departBusStation
      );
      if (!foundDepartBusStation) return [];
      return foundDepartBusStation.gates.map(({ name }) => name);
    },
    onChangeDepartBusStation(index) {
      this.stationForms[index].departGate = "";
    },
    getArriveGatesValues(form, index) {
      const foundArriveBusStation = this.busStations.find(
        ({ name }) => name === form.arriveBusStation
      );
      if (!foundArriveBusStation) return [];
      return foundArriveBusStation.gates.map(({ name }) => name);
    },
    onChangeArriveBusStation(index) {
      this.stationForms[index].arriveGate = "";
    }
  }
};
</script>
