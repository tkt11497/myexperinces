<template>
  <div>
    <v-layout row wrap mx-3 my-3>
      <h6 class="title">Vouchers</h6>
    </v-layout>
    <v-layout row wrap>
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Voucher ID</v-flex
      >
      <v-flex text-xs-center xs1 class="cell font-weight-bold">Customer</v-flex>
      <v-flex text-xs-center xs1 class="cell font-weight-bold">Phone</v-flex>
      <v-flex text-xs-center xs2 class="cell font-weight-bold">Address</v-flex>
      <v-flex text-xs-center xs2 class="cell font-weight-bold">To</v-flex>
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Item Price</v-flex
      >
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Payment Status</v-flex
      >
      <v-flex text-xs-center xs1 class="cell font-weight-bold"
        >Amount to Collect</v-flex
      >
    </v-layout>
    <v-layout v-show="normalForms.length === 0">
      <v-flex class="cell font-weight-bold" xs12 text-xs-center
        >--- Empty --</v-flex
      >
    </v-layout>
    <div v-for="(normalVoucherForm, index) in normalForms" :key="index">
      <form
        browser-autocomplete="off"
        @submit.prevent="onSubmitNormalVoucher(normalVoucherForm, index)"
        v-if="!normalVoucherForm.isLocked"
      >
        <v-layout>
          <v-flex class="cell" xs1>
            <!-- customer -->
            <v-text-field
              browser-autocomplete="off"
              :id="'normal-' + index + '-voucherId'"
              :name="'normal-' + index + '-voucherId'"
              :ref="'normal-' + index + '-voucherId'"
              v-model="normalVoucherForm.voucherId"
              disabled
              readonly
            ></v-text-field>
          </v-flex>
          <v-flex class="cell" xs1>
            <!-- customer -->
            <v-text-field
              browser-autocomplete="off"
              :id="'normal-' + index + '-customerName'"
              :name="'normal-' + index + '-customerName'"
              :ref="'normal-' + index + '-customerName'"
              v-model="normalVoucherForm.customerName"
              type="'text'"
              v-validate="'required'"
              :error="!!errors.first('customerName')"
              :error-messages="errors.first('customerName')"
            ></v-text-field>
          </v-flex>
          <v-flex class="cell" xs1>
            <!-- phone -->
            <v-text-field
              browser-autocomplete="off"
              :id="'normal-' + index + '-customerPhone'"
              :name="'normal-' + index + '-customerPhone'"
              :ref="'normal-' + index + '-customerPhone'"
              type="tel"
              v-model="normalVoucherForm.customerPhone"
              v-validate="'required|numeric'"
              :error="!!errors.first(`${index}-n-customerPhone`)"
              :error-messages="errors.first(`${index}-n-customerPhone`)"
            ></v-text-field>
          </v-flex>
          <v-flex class="cell" xs2>
            <!-- address -->
            <v-text-field
              browser-autocomplete="off"
              :id="'normal-' + index + '-customerAddress'"
              :name="'normal-' + index + '-customerAddress'"
              :ref="'normal-' + index + '-customerAddress'"
              v-model="normalVoucherForm.customerAddress"
              :error="!!errors.first('customerAddress')"
              :error-messages="errors.first('customerAddress')"
            ></v-text-field>
          </v-flex>
          <v-flex class="cell" xs2>
            <!-- to -->
            <v-layout>
              <v-flex xs6>
                <v-autocomplete
                  :id="'normal-' + index + '-toCity'"
                  :name="'normal-' + index + '-toCity'"
                  :ref="'normal-' + index + '-toCity'"
                  label="City"
                  v-model="normalVoucherForm.toCity"
                  :items="citiesValues"
                  @change="onChangeToCity(index)"
                  v-validate="'required'"
                  :error="!!errors.first('toCity')"
                  :error-messages="errors.first('toCity')"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  :id="'normal-' + index + '-toZone'"
                  :name="'normal-' + index + '-toZone'"
                  :ref="'normal-' + index + '-toZone'"
                  label="Zone"
                  v-model="normalVoucherForm.toZone"
                  :items="getToZonesValues(normalVoucherForm, index)"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex class="cell" xs1>
            <!-- itemPrice -->
            <v-text-field
              browser-autocomplete="off"
              :id="'normal-' + index + '-itemPrice'"
              :name="'normal-' + index + '-itemPrice'"
              :ref="'normal-' + index + '-itemPrice'"
              v-model="normalVoucherForm.itemPrice"
              type="number"
              v-validate="'required'"
              :error="!!errors.first('itemPrice')"
              :error-messages="errors.first('itemPrice')"
            ></v-text-field>
          </v-flex>
          <v-flex class="cell" xs1>
            <!-- paymentType -->
            <v-autocomplete
              :id="'normal-' + index + '-paymentType'"
              :name="'normal-' + index + '-paymentType'"
              :ref="'normal-' + index + '-paymentType'"
              v-model="normalVoucherForm.paymentType"
              :items="paymentTypesValues"
              v-validate="'required'"
              :error="!!errors.first('paymentType')"
              :error-messages="errors.first('paymentType')"
            ></v-autocomplete>
          </v-flex>
          <v-flex class="cell" xs1>
            <!-- amountToCollect -->
            <v-text-field
              browser-autocomplete="off"
              :id="'normal-' + index + '-amountToCollect'"
              :name="'normal-' + index + '-amountToCollect'"
              :ref="'normal-' + index + '-amountToCollect'"
              v-model="normalVoucherForm.amountToCollect"
              readonly
              disabled
            ></v-text-field>
          </v-flex>
          <v-flex class="cell" xs1 v-show="false">
            <!-- actions -->
            <v-btn
              v-show="false"
              color="green darken-1"
              type="submit"
              flat
              icon
            >
              <v-icon>done</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </form>
      <v-layout v-else>
        <v-flex text-xs-center class="cell" xs1>{{
          normalVoucherForm.voucherId
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs1>{{
          normalVoucherForm.customerName
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs1>{{
          normalVoucherForm.customerPhone
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs2>{{
          normalVoucherForm.customerAddress
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs2>{{
          `${normalVoucherForm.toCity} - ${normalVoucherForm.toZone}`
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs1>{{
          normalVoucherForm.itemPrice
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs1>{{
          normalVoucherForm.paymentType
        }}</v-flex>
        <v-flex text-xs-center class="cell" xs1>{{
          normalVoucherForm.amountToCollect
        }}</v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    normalForms: { type: Array, required: true },
    citiesValues: { type: Array, required: true },
    cities: { type: Array, required: true },
    paymentTypesValues: { type: Array, required: true }
  },
  // watch: {
  //   async normalForms(newForms, oldForms) {
  //     await this.$nextTick();
  //     this.$refs["0-n-customerName"][0].focus();
  //   }
  // },
  methods: {
    onSubmitNormalVoucher(form, index) {
      this.$emit("onSubmitNormalVoucher", { form, index, that: this });
    },
    getFromZonesValues(form, index) {
      const foundFromCity = this.cities.find(
        city => city.name === form.fromCity
      );
      if (!foundFromCity) return [];
      if (!foundFromCity.zones) return;
      return foundFromCity.zones.map(zone => zone.name);
    },
    onChangeFromCity(index) {
      this.normalForms[index].fromZone = "";
    },
    getToZonesValues(form, index) {
      const foundToCity = this.cities.find(city => city.name === form.toCity);
      if (!foundToCity) return;
      if (!foundToCity.zones) return;
      return foundToCity.zones.map(zone => zone.name);
    },
    onChangeToCity(index) {
      this.normalForms[index].toZone = "";
    }
  }
};
</script>
