<template>
  <div>
    <v-layout>
      <v-flex xs4 pa-3>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Sender</v-flex>
          <v-flex xs8>{{ sender.name + " - " + sender_type }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Phone</v-flex>
          <v-flex xs8>{{ phones }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Address</v-flex>
          <v-flex xs8>{{ address }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">City/ Zone</v-flex>
          <v-flex xs8>{{ `${city.name} - ${zone.name}` }}</v-flex>
        </v-layout>
        <v-layout row wrap mt-4>
          <v-chip color="indigo white--text" class="ml-0" large>
            <span color="white--text">Total {{ vouchers.length || 0 }} vouchers</span>
          </v-chip>
        </v-layout>
      </v-flex>
      <v-flex xs4 pa-3>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Pick Up</v-flex>
          <v-flex xs8>{{ pickup_invoice }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Note</v-flex>
          <v-flex xs8>{{ note || "--Empty--" }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Pickup By</v-flex>
          <v-flex xs8>{{ getOpenedByName() || "Not Selected" }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Closing Status</v-flex>
          <v-flex xs8>{{ is_closed ? "Close" : "Open" }}</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs4 class="font-weight-bold">Payment Status</v-flex>
          <v-flex xs8>{{ is_paid ? "Paid" : "Unpaid" }}</v-flex>
        </v-layout>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs2 pl-1 pt-1>
        <v-layout row wrap justify-end>
          <v-btn color="primary" @click="closePickup" :disabled="is_closed">Close Pickup</v-btn>
          <v-btn
            color="primary"
            @click="createNewNormalVoucher"
            :disabled="is_closed"
          >New Voucher (ctrl + 1)</v-btn>
          <v-btn
            color="primary"
            @click="createNewBusStationVoucher"
            :disabled="is_closed"
          >Bus-station Drop Off (ctrl + 2)</v-btn>
          <v-btn v-print color="primary">Print</v-btn>

          <v-btn
            color="primary"
            target="_blank"
            :href="`/pickups/${voucher_id}/print_all`"
          >print all</v-btn>
        </v-layout>
        <v-layout row wrap justify-end>
          <download-excel
            :name="'Pickup - ' + pickup_invoice + '.xls'"
            :data="vouchers"
            :fields="excelHeaders"
            class="v-btn v-btn--normal primary"
          >Export</download-excel>
        </v-layout>
        <v-layout row wrap justify-end>
          <v-btn
            color="primary"
            @click="show = !show"
            :loading="loading"
            :disabled="is_closed"
          >{{ show ? "Cancel" : "Import" }}</v-btn>
          <input label="File input" type="file" @change="importVouchers" v-show="show" />
        </v-layout>
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    voucher_id: { type: Number },
    sender: { type: Object },
    sender_type: { type: String },
    phones: { type: String },
    address: { type: String },
    city: { type: Object },
    zone: { type: Object },
    pickup_invoice: { type: String },
    note: { type: String },
    opened_by: { type: Object },
    is_closed: { type: Boolean },
    is_paid: { type: Boolean },
    vouchers: { type: Array },
    excelHeaders: { type: Object }
  },
  data() {
    return {
      loading: false,
      show: false
    };
  },
  methods: {
    createNewNormalVoucher() {
      this.$emit("createNewNormalVoucher");
    },
    createNewBusStationVoucher() {
      this.$emit("createNewBusStationVoucher");
    },
    closePickup() {
      this.$emit("closePickup");
    },
    importVouchers(evt) {
      const files = evt.target.files;
      if (files && files[0]) this._file(files[0]);
      this.show = false;
      this.loading = true;
    },
    _file(file) {
      const reader = new FileReader();
      reader.onload = e => {
        const bstr = e.target.result;
        const wb = this.$XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = this.$XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.$emit("importVouchers", data);
      };
      reader.readAsBinaryString(file);
    },
    getOpenedByName() {
      try {
        return this.opened_by.name;
      } catch (error) {
        return "unassigned yet";
      }
    }
  },
  mounted() {
    this.$parent.$on("imported", () => {
      this.loading = false;
    });
  }
};
</script>
