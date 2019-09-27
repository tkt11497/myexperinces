<template>
  <div>
    <div class="pl-2 pr-2 no-print">
      <AppLoading :isLoading="isLoading"></AppLoading>
      <ShortKeys
        @createNewBusStationVoucher="createNewBusStationVoucher"
        @createNewNormalVoucher="createNewNormalVoucher"
        @onSubmit="onSubmit"
        @nextRow="nextRow"
        @previousRow="previousRow"
        @onUnlockForm="onUnlockForm"
        @onDelRow="onDelRow"
      ></ShortKeys>
      <Info
        :voucher_id="id"
        :sender="sender"
        :sender_type="sender_type"
        :phones="phones"
        :address="address"
        :city="city"
        :zone="zone"
        :pickup_invoice="pickup_invoice"
        :note="note"
        :opened_by="opened_by"
        :is_closed="is_closed"
        :is_paid="is_paid"
        :vouchers="vouchers"
        :excelHeaders="excelHeaders"
        @closePickup="closePickup"
        @createNewNormalVoucher="createNewNormalVoucher"
        @createNewBusStationVoucher="createNewBusStationVoucher"
        @importVouchers="importVouchers"
      ></Info>

      <v-layout mx-3 my-3>
        <h6 class="title">Vouchers</h6>
      </v-layout>
      <NormalTableHeaders></NormalTableHeaders>

      <v-layout v-show="normalForms.length === 0">
        <v-flex class="cell font-weight-bold" xs12 text-xs-center>--- Empty --</v-flex>
      </v-layout>

      <div v-for="(normalVoucherForm, index) in normalForms" :key="index">
        <form browser-autocomplete="off" v-if="!normalVoucherForm.isLocked">
          <v-hover>
            <v-layout>
              <v-flex class="cell" xs1>
                <v-text-field
                  browser-autocomplete="off"
                  :value="getVoucherNumberAndStatus(normalVoucherForm)"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex class="cell" xs1>
                <v-text-field
                  browser-autocomplete="off"
                  :ref="`normal-${index}-receiverName`"
                  :name="`normal-${index}-receiverName`"
                  v-model="normalVoucherForm.receiver.name"
                  type="'text'"
                  :error="!normalVoucherForm.receiver.name"
                ></v-text-field>
              </v-flex>
              <v-flex class="cell" xs1>
                <v-text-field
                  browser-autocomplete="off"
                  type="tel"
                  :ref="`normal-${index}-receiverPhone`"
                  :name="`normal-${index}-receiverPhone`"
                  v-model="normalVoucherForm.receiver.phone"
                  :error="!normalVoucherForm.receiver.phone"
                ></v-text-field>
              </v-flex>
              <v-flex class="cell" xs2>
                <!-- address -->
                <v-text-field
                  browser-autocomplete="off"
                  :ref="`normal-${index}-receiverAddress`"
                  :name="`normal-${index}-receiverAddress`"
                  v-model="normalVoucherForm.receiver.address"
                  :error="!normalVoucherForm.receiver.address"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 class="cell">
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-autocomplete
                      label="City"
                      :ref="`normal-${index}-receiverCity`"
                      :name="`normal-${index}-receiverCity`"
                      v-model="normalVoucherForm.receiver_city"
                      :items="citiesD2D"
                      item-text="name"
                      item-value="id"
                      :disabled="normalVoucherForm.is_closed"
                      @change="
                      id => onChangeCity({ id, form: normalVoucherForm })
                    "
                      :error="!normalVoucherForm.receiver_city"
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs6>
                    <v-autocomplete
                      label="Zone"
                      :ref="`normal-${index}-receiverZone`"
                      :name="`normal-${index}-receiverZone`"
                      v-model="normalVoucherForm.receiver_zone"
                      :items="normalVoucherForm.receiverZones"
                      item-text="name"
                      item-value="id"
                      :disabled="normalVoucherForm.is_closed"
                      :error="!normalVoucherForm.receiver_zone"
                    ></v-autocomplete>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex class="cell" xs1>
                <!-- total_item_price -->
                <v-text-field
                  browser-autocomplete="off"
                  :ref="`normal-${index}-totalItemPrice`"
                  :name="`normal-${index}-totalItemPrice`"
                  :disabled="normalVoucherForm.is_closed"
                  v-model="normalVoucherForm.total_item_price"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 class="cell">
                <!-- global_scale -->
                <v-layout row wrap>
                  <v-flex xs6>
                    <v-text-field
                      label="lwh"
                      browser-autocomplete="off"
                      :ref="`normal-${index}-global_scale`"
                      :name="`normal-${index}-global_scale`"
                      :disabled="normalVoucherForm.is_closed"
                      v-model="normalVoucherForm.global_scale"
                      type="number"
                      min="0"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      label="weight"
                      browser-autocomplete="off"
                      :ref="`normal-${index}-weight`"
                      :name="`normal-${index}-weight`"
                      :disabled="normalVoucherForm.is_closed"
                      v-model="normalVoucherForm.weight"
                      type="number"
                      min="0"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex class="cell" xs1>
                <v-autocomplete
                  :ref="`normal-${index}-paymentType`"
                  :name="`normal-${index}-paymentType`"
                  v-model="normalVoucherForm.payment_type"
                  :items="
                  getNormalVoucherPaymentTypes({ form: normalVoucherForm })
                "
                  item-text="name_mm"
                  item-value="id"
                  :disabled="normalVoucherForm.is_closed"
                  :error="!normalVoucherForm.payment_type"
                ></v-autocomplete>
              </v-flex>
              <v-flex class="cell" xs1>
                <v-text-field
                  browser-autocomplete="off"
                  :disabled="true"
                  v-model="normalVoucherForm.total_delivery_amount"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-flex>
              <v-flex class="cell" xs1>
                <v-autocomplete
                  :ref="`normal-${index}-callStatus`"
                  :name="`normal-${index}-callStatus`"
                  v-model="normalVoucherForm.call_status"
                  :items="callStatuses"
                  item-text="status_mm"
                  item-value="id"
                ></v-autocomplete>
              </v-flex>
              <AppCell>
                <v-autocomplete
                  :ref="`normal-${index}-storeStatus`"
                  :name="`normal-${index}-storeStatus`"
                  :items="getStoreStatuses()"
                  v-model="normalVoucherForm.store_status"
                  item-text="status_mm"
                  item-value="id"
                ></v-autocomplete>
              </AppCell>
              <AppCell>
                <v-btn
                  color="green darken-1"
                  flat
                  icon
                  @click="onSubmit"
                  :ref="`normal-${index}-submit`"
                  :name="`normal-${index}-submit`"
                >
                  <v-icon>done</v-icon>
                </v-btn>
                <v-btn
                  color="red darken-1"
                  flat
                  icon
                  @click="
                  cancelForm({
                    form: normalVoucherForm,
                    forms: normalForms,
                    index
                  })
                "
                  :ref="`normal-${index}-cancel`"
                  :name="`normal-${index}-cancel`"
                >
                  <v-icon>cancel</v-icon>
                </v-btn>
              </AppCell>
            </v-layout>
          </v-hover>
        </form>
        <button
          :ref="'normal-' + index + '-rowButton'"
          :name="`normal-${index}-button`"
          style="width: 100%"
          :class="[
          sTable === 'normal' && index == sIndex ? 'row-active' : '',
          'row-button'
        ]"
          @dblclick="goDetails(normalVoucherForm.id)"
          v-else
        >
          <v-hover>
            <v-layout slot-scope="{ hover }">
              <AppCell>{{ getVoucherNumberAndStatus(normalVoucherForm) }}</AppCell>
              <AppCell>{{ normalVoucherForm.receiver.name }}</AppCell>
              <AppCell>{{ normalVoucherForm.receiver.phone }}</AppCell>
              <v-flex xs2 class="cell">{{ normalVoucherForm.receiver.address }}</v-flex>
              <v-flex xs2 class="cell">
                {{
                `${normalVoucherForm.receiver_city.name} - ${
                normalVoucherForm.receiver_zone
                ? normalVoucherForm.receiver_zone.name
                : ""
                }`
                }}
              </v-flex>
              <AppCell>{{ normalVoucherForm.total_item_price }}</AppCell>
              <v-flex
                xs2
                class="cell"
              >{{ `${normalVoucherForm.lwh || 20} - ${normalVoucherForm.weight}`}}</v-flex>
              <AppCell>{{ normalVoucherForm.payment_type.name_mm }}</AppCell>

              <AppCell>{{ normalVoucherForm.total_delivery_amount }}</AppCell>
              <AppCell>{{ normalVoucherForm.call_status.status_mm }}</AppCell>
              <AppCell>{{ normalVoucherForm.store_status.id == 2 ? normalVoucherForm.store_status.status_mm : 'စောင့်ဆိုင်း' }}</AppCell>
              <v-flex xs1 class="cell">
                <v-layout :class="hover ? 'show' : 'hide'">
                  <v-btn
                    flat
                    icon
                    color="green"
                    @click="onClickEdit"
                    :name="'normal-' + index + '-editButton'"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn
                    flat
                    icon
                    :disabled="normalVoucherForm.is_closed"
                    color="red"
                    @click="onClickDel"
                    :name="'normal-' + index + '-delButton'"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-layout>
                <v-layout class="show">
                  <v-btn
                    flat
                    icon
                    color="grey"
                    target="_blank"
                    :href="`/vouchers/print?voucher_no=${normalVoucherForm.voucher_no}&created_at=${normalVoucherForm.created_at}&created_time=${normalVoucherForm.created_time}&sender_name=${sender.name}&sender_phone=${phones}
                    &receiver_name=${normalVoucherForm.receiver.name}&receiver_phone=${normalVoucherForm.receiver.phone}&receiver_other_phone=${normalVoucherForm.receiver.other_phone || '--Empty--'}&receiver_city_name=${normalVoucherForm.receiver_city.name}&receiver_zone_name=${ normalVoucherForm.receiver_zone ? normalVoucherForm.receiver_zone.name : '--Empty--' }&receiver_address=${normalVoucherForm.receiver.address || '--Empty--'}&remark=${normalVoucherForm.remark || '--Empty--'}&amount_to_collect_receiver=${normalVoucherForm.amount_to_collect_receiver}`"
                  >
                    <v-icon>print</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-hover>
        </button>
      </div>

      <div>
        <v-layout row wrap mx-3 my-3>
          <h6 class="title">Bus Station Vouchers</h6>
        </v-layout>
        <StationTableHeaders></StationTableHeaders>
        <v-layout v-show="stationForms.length === 0">
          <v-flex class="cell font-weight-bold" xs12 text-xs-center>--- Empty --</v-flex>
        </v-layout>
        <div v-for="(form, index) in stationForms" :key="index">
          <button
            :ref="'station-' + index + '-rowButton'"
            style="width: 100%"
            v-if="form.isLocked"
            @dblclick="goDetails(form.id)"
            :class="[
            sTable === 'station' && index == sIndex ? 'row-active' : '',
            'row-button'
          ]"
            :name="`station-${index}-button`"
          >
            <v-hover>
              <v-layout slot-scope="{ hover }">
                <AppCell>{{ getVoucherNumberAndStatus(form) }}</AppCell>
                <AppCell>{{ form.receiver.name }}</AppCell>
                <AppCell>{{ form.receiver.phone }}</AppCell>

                <AppCell>{{ getReceiverCityName(form) }}</AppCell>
                <v-flex xs2>
                  <v-layout style="height: 100%">
                    <v-flex class="cell" xs6>{{ form.sender_bus_station.name }}</v-flex>
                    <v-flex class="cell" xs6>{{ form.receiver_bus_station.name}}</v-flex>
                  </v-layout>
                </v-flex>
                <AppCell>{{ form.sender_gate.name }}</AppCell>
                <AppCell>{{ form.total_item_price }}</AppCell>
                <v-flex xs2>
                  <v-layout style="height: 100%">
                    <v-flex class="cell" xs6>{{ form.lwh }}</v-flex>
                    <v-flex class="cell" xs6>{{ form.weight }}</v-flex>
                  </v-layout>
                </v-flex>
                <AppCell>{{ form.payment_type.name_mm }}</AppCell>

                <AppCell>{{ form.total_delivery_amount }}</AppCell>
                <AppCell>{{ form.call_status.status_mm }}</AppCell>
                <AppCell>{{ form.store_status.status_mm }}</AppCell>
                <AppCell>
                  <v-layout :class="hover ? 'show' : 'hide'">
                    <v-btn
                      flat
                      icon
                      color="green"
                      @click="onClickEdit"
                      :name="'station-' + index + '-editButton'"
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn
                      flat
                      icon
                      color="red"
                      @click="onClickDel"
                      :name="'station-' + index + '-delButton'"
                      :disabled="form.is_closed"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-layout>
                  <v-layout class="show">
                    <v-btn
                      flat
                      icon
                      color="grey"
                      target="_blank"
                      :href="`/vouchers/print?voucher_no=${form.voucher_no}&created_at=${form.created_at}&created_time=${form.created_time}&sender_name=${sender.name}&sender_phone=${phones}
                    &receiver_name=${form.receiver.name}&receiver_phone=${form.receiver.phone}&receiver_other_phone=${form.receiver.other_phone || '--Empty--'}&receiver_city_name=${form.receiver_city.name}&receiver_zone_name=${ form.receiver_zone ? form.receiver_zone.name : '--Empty--' }&receiver_address=${form.receiver.address || '--Empty--'}&remark=${form.remark || '--Empty--'}&amount_to_collect_receiver=${form.amount_to_collect_receiver}`"
                    >
                      <v-icon>print</v-icon>
                    </v-btn>
                  </v-layout>
                </AppCell>
              </v-layout>
            </v-hover>
          </button>

          <form v-else browser-autocomplete="off">
            <v-layout row wrap>
              <v-flex xs12>
                <v-layout row wrap>
                  <AppCell>
                    <v-text-field
                      browser-autocomplete="off"
                      :value="getVoucherNumberAndStatus(form)"
                      disabled
                      readonly
                    ></v-text-field>
                  </AppCell>
                  <AppCell>
                    <v-text-field
                      browser-autocomplete="off"
                      :ref="`station-${index}-receiverName`"
                      :name="`station-${index}-receiverName`"
                      v-model="form.receiver.name"
                      :disabled="form.is_closed"
                      :error="!form.receiver.name"
                    ></v-text-field>
                  </AppCell>
                  <AppCell>
                    <v-text-field
                      browser-autocomplete="off"
                      :ref="`station-${index}-receiverPhone`"
                      :name="`station-${index}-receiverPhone`"
                      v-model="form.receiver.phone"
                      :disabled="form.is_closed"
                      :error="!form.receiver.phone"
                    ></v-text-field>
                  </AppCell>
                  <AppCell>
                    <v-autocomplete
                      :items="getReceiverCities()"
                      :ref="`station-${index}-receiverCity`"
                      :name="`station-${index}-receiverCity`"
                      item-text="name"
                      item-value="id"
                      v-model="form.receiver_city"
                      @change="id => onChangeReceiverCity({ form, id })"
                      :disabled="form.is_closed"
                      :error="!form.receiver_city"
                    ></v-autocomplete>
                  </AppCell>

                  <v-flex xs2>
                    <v-layout style="height: 100%">
                      <v-flex class="cell" xs6>
                        <v-autocomplete
                          :ref="`station-${index}-senderStation`"
                          :name="`station-${index}-senderStation`"
                          label="Sender Bus Station"
                          v-model="form.sender_bus_station"
                          :items="senderStations"
                          item-text="name"
                          item-value="id"
                          @change="
                      id => onChangeStation({ id, form, flag: 'sender' })
                    "
                          :disabled="form.is_closed"
                          :error="!form.sender_bus_station"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex class="cell" xs6>
                        <v-autocomplete
                          :ref="`station-${index}-receiverStation`"
                          :name="`station-${index}-receiverStation`"
                          label="Receiver Bus Station"
                          v-model="form.receiver_bus_station"
                          :items="form.receiverStations"
                          item-text="name"
                          item-value="id"
                          @change="
                      id => onChangeStation({ id, form, flag: 'receiver' })
                    "
                          :disabled="form.is_closed"
                          :error="!form.receiver_bus_station"
                        ></v-autocomplete>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <AppCell>
                    <v-autocomplete
                      :ref="`station-${index}-gate`"
                      :name="`station-${index}-gate`"
                      label="Gate"
                      v-model="form.sender_gate"
                      :items="form.intersectionGates"
                      item-text="name"
                      item-value="id"
                      :disabled="form.is_closed"
                      @change="id => onChangeSenderGate({ id, form })"
                      :error="!form.sender_gate"
                    ></v-autocomplete>
                  </AppCell>
                  <AppCell>
                    <v-text-field
                      browser-autocomplete="off"
                      :disabled="form.is_closed"
                      :ref="`station-${index}-totalItemPrice`"
                      :name="`station-${index}-totalItemPrice`"
                      v-model="form.total_item_price"
                      min="0"
                      type="number"
                    ></v-text-field>
                  </AppCell>
                  <v-flex xs2>
                    <!-- global_scale -->
                    <v-layout style="height: 100%">
                      <v-flex class="cell" xs6>
                        <v-text-field
                          label="lwh"
                          browser-autocomplete="off"
                          :ref="`station-${index}-global_scale`"
                          :name="`station-${index}-global_scale`"
                          :disabled="form.is_closed"
                          v-model="form.global_scale"
                          type="number"
                          min="0"
                        ></v-text-field>
                      </v-flex>
                      <v-flex class="cell" xs6>
                        <v-text-field
                          label="weight"
                          browser-autocomplete="off"
                          :ref="`station-${index}-weight`"
                          :name="`station-${index}-weight`"
                          :disabled="form.is_closed"
                          v-model="form.weight"
                          type="number"
                          min="0"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <AppCell>
                    <v-autocomplete
                      :ref="`station-${index}-paymentType`"
                      :name="`station-${index}-paymentType`"
                      v-model="form.payment_type"
                      :items="getStationVoucherPaymentTypes({ form })"
                      item-text="name_mm"
                      item-value="id"
                      :disabled="form.is_closed"
                      :error="!form.payment_type"
                    ></v-autocomplete>
                  </AppCell>
                  <AppCell>
                    <v-autocomplete
                      :ref="`station-${index}-callStatus`"
                      :name="`station-${index}-callStatus`"
                      v-model="form.call_status"
                      :items="callStatuses"
                      item-text="status_mm"
                      item-value="id"
                    ></v-autocomplete>
                  </AppCell>
                  <AppCell>
                    <v-autocomplete
                      :ref="`station-${index}-storeStatus`"
                      :name="`station-${index}-storeStatus`"
                      :items="getStoreStatuses()"
                      v-model="form.store_status"
                      item-text="status_mm"
                      item-value="id"
                    ></v-autocomplete>
                  </AppCell>
                  <AppCell>
                    <v-btn
                      color="green darken-1"
                      flat
                      icon
                      @click="onSubmit"
                      :ref="`station-${index}-submit`"
                      :name="`station-${index}-submit`"
                    >
                      <v-icon>done</v-icon>
                    </v-btn>
                    <v-btn
                      color="red darken-1"
                      flat
                      icon
                      @click="cancelForm({ form, forms: stationForms, index })"
                      :ref="`station-${index}-cancel`"
                      :name="`station-${index}-cancel`"
                    >
                      <v-icon>cancel</v-icon>
                    </v-btn>
                  </AppCell>
                </v-layout>
              </v-flex>
            </v-layout>
          </form>
        </div>
      </div>
      <v-layout>
        <v-flex xs6>
          <v-layout>
            <v-btn color="primary" @click="showHistory">
              {{
              interpretedLogs.length === 0
              ? "Show Pickup History"
              : "Update Pickup History"
              }}
            </v-btn>
          </v-layout>
          <v-layout mt-2 pr-5>
            <AppLog :interpretedLogs="interpretedLogs"></AppLog>
          </v-layout>
        </v-flex>
        <v-flex xs3></v-flex>
        <v-flex xs3>
          <v-layout>
            <v-checkbox
              @click.native="onPickupFeeUpdate"
              label="Pickup fee"
              v-model="take_pickup_fee"
              :disabled="is_closed"
            ></v-checkbox>
          </v-layout>
          <CostInformation
            :titleEn="'Prepaid'"
            :titleMm="'ကြိုပေးချေရန်'"
            :info="total_prepaid_amount"
          ></CostInformation>
          <CostInformation :titleEn="'Pick Up Fee'" :titleMm="'ပစ်ကပ်ကြေး'" :info="pickup_fee"></CostInformation>
          <CostInformation
            :titleEn="'Total Amount Sender'"
            :titleMm="'ပေးပို့သူထံမှကောက်ယူရန်'"
            :info="total_prepaid_amount + pickup_fee"
          ></CostInformation>
        </v-flex>
      </v-layout>
      <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
        {{ snackbarMessage }}
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-layout row justify-center>
        <v-dialog v-model="isOpenActionDialog" width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ actionMessage }}</span>
            </v-card-title>
            <v-card-actions>
              <v-btn color="green darken-1" flat="flat" @click="cancelAction">Cancel</v-btn>
              <v-btn color="red darken-1" flat="flat" @click="submitAction">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </div>

    <div id="printPickup">
      <v-layout row mt-1>
        <v-flex xs3>
          <v-layout row wrap>
            <v-flex xs2 class="font-weight-bold">Date:</v-flex>
            <v-flex xs4 class="text-xs-right">{{ created_at }}</v-flex>
            <v-flex xs2 offset-xs1 class="font-weight-bold text-xs-left">Time:</v-flex>
            <v-flex xs4 class="text-xs-right">{{ created_time }}</v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs7 text-xs-center row>
          <h1 class="title font-weight-regular">Marathon Myanmar</h1>
          <h1 class="title font-weight-regular text-xs-center">Nationwide Parcel Delivery Service</h1>
        </v-flex>
        <v-flex xs3 class="font-weight-light">
          <v-layout row>
            <span>09777241334</span>
            <span class="ml-5">09777241335</span>
          </v-layout>
        </v-flex>
      </v-layout>
      <!-- <h1 class="headline font-weight-regular text-xs-center mt-1">Marathon Myanmar</h1>
      <h1 class="title font-weight-regular text-xs-center mt-1">Nationwide Parcel Delivery Service</h1>
      <v-layout row mt-1>
        <v-flex xs12 class="text-xs-center font-weight-light">
          <span class="mr-5">09777241334</span>
          <span class="ml-5">09777241335</span>
        </v-flex>
      </v-layout>
      <h1 class="title font-weight-bold text-xs-center mt-4">Pickup - {{ pickup_invoice }}</h1>-->
      <v-layout row wrap mt-3>
        <v-flex xs6>
          <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Pickup ID</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ pickup_invoice }}</v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Sender</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ sender.name + " - " + sender_type }}</v-flex>
          </v-layout>
          <!-- <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Phone</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ phones }}</v-flex>
          </v-layout>-->
          <!-- <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Address</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ address }}</v-flex>
          </v-layout>-->
          <!-- <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">City/Zone</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ `${city.name} - ${zone.name}` }}</v-flex>
          </v-layout>-->
        </v-flex>
        <v-flex xs6>
          <!-- <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Created Date</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ created_at }}</v-flex>
          </v-layout>-->
          <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Pickup By</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ opened_by ? opened_by.name : "unassigned yet" }}</v-flex>
          </v-layout>
          <!-- <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Closing Status</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ is_closed ? "Close" : "Open" }}</v-flex>
          </v-layout>-->
          <!-- <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Payment Status</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ is_paid ? "Paid" : "Unpaid" }}</v-flex>
          </v-layout>-->
          <v-layout row wrap>
            <v-flex xs3 class="font-weight-bold">Note</v-flex>
            <v-spacer></v-spacer>
            <v-flex xs8>{{ note || "--Empty--" }}</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-layout row wrap mt-3>
        <h6 class="title">Normal Vouchers</h6>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <v-data-table
            :headers="printNormalFormsHeaders"
            :items="printNormalForms"
            hide-actions
            class="elevation-1"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ printNormalForms.indexOf(props.item) + 1 }}</td>
                <td>{{ props.item.voucher_no }}</td>
                <td>{{ props.item.receiver.name }}</td>
                <td>{{ props.item.receiver.phone }}</td>
                <td>{{ props.item.receiver.address }}</td>
                <td>{{ `${props.item.receiver_city.name} - ${props.item.receiver_zone? props.item.receiver_zone.name: ""}` }}</td>
                <td>{{ props.item.total_item_price }}</td>
                <td>{{ `${props.item.lwh} - ${props.item.weight}` }}</td>
                <td>{{ props.item.payment_type.name_mm }}</td>
                <td>{{ props.item.amount_to_collect_sender }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap mt-5>
        <h6 class="title">Bus Station Vouchers</h6>
      </v-layout>
      <v-layout>
        <v-flex xs12>
          <v-data-table
            :headers="printStationFormsHeaders"
            :items="printStationsForms"
            hide-actions
            class="elevation-1"
          >
            <template v-slot:items="props">
              <tr>
                <td>{{ printStationsForms.indexOf(props.item) + 1 }}</td>
                <td>{{ props.item.voucher_no }}</td>
                <td>{{ props.item.receiver.name }}</td>
                <td>{{ props.item.receiver.phone }}</td>
                <td>{{ getReceiverCityName(props.item) }}</td>
                <td>{{ `${props.item.sender_bus_station.name} - ${props.item.receiver_bus_station ? props.item.receiver_bus_station.name: ""}` }}</td>
                <td>{{ props.item.sender_gate.name }}</td>
                <td>{{ props.item.total_item_price }}</td>
                <td>{{ `${props.item.lwh} - ${props.item.weight}` }}</td>
                <td>{{ props.item.payment_type.name_mm }}</td>
                <td>{{ props.item.amount_to_collect_sender }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap mt-2 justify-end>
        <v-flex xs4 offset-xs8>
          <v-layout row wrap>
            <v-flex xs5 class="text-xs-right">Prepaid</v-flex>
            <v-flex xs5 class="text-xs-right">{{ total_prepaid_amount }} KS</v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs5 class="text-xs-right">Pick Up Fee</v-flex>
            <v-flex xs5 class="text-xs-right">{{ pickup_fee }} KS</v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs5 class="text-xs-right">Total Amount Sender</v-flex>
            <v-flex xs5 class="text-xs-right">{{ total_prepaid_amount + pickup_fee }} KS</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import localforage from "localforage";
import validator from "validator";
import {
  handleStatus,
  handleStatusInAsyncData,
  interpretLog,
  getAllLocalForage,
  getId
} from "@/assets/utilities/helpers/common";
import helpers from "@/assets/utilities/helpers/pickupDetails";

import AppLoading from "@/components/App/loading";
import AppLog from "@/components/App/Log";
import CostInformation from "@/components/PickupDetails/CostInformation";
import AppCell from "@/components/App/Cell";
import Info from "@/components/PickupDetails/Info";
import NormalTableHeaders from "@/components/PickupDetails/NormalTableHeaders";
import StationTableHeaders from "@/components/PickupDetails/StationTableHeaders";
import ShortKeys from "@/components/PickupDetails/ShortKeys";

export default {
  middleware: ["auth"],
  data() {
    return {
      printNormalFormsHeaders: [
        { text: "#", sortable: false },
        { text: "Voucher", sortable: false },
        { text: "Customer", sortable: false },
        { text: "Phone", sortable: false },
        { text: "Address", sortable: false },
        { text: "To", sortable: false },
        { text: "Item Price", sortable: false },
        { text: "Global Scale", sortable: false },
        { text: "Payment Status", sortable: false },
        { text: "ATC", sortable: false }
      ],
      printStationFormsHeaders: [
        { text: "#", sortable: false },
        { text: "Voucher", sortable: false },
        { text: "Customer", sortable: false },
        { text: "Phone", sortable: false },
        { text: "To City", sortable: false },
        { text: "From to Station", sortable: false },
        { text: "Bus", sortable: false },
        { text: "Item Price", sortable: false },
        { text: "Global Scale", sortable: false },
        { text: "Payment Status", sortable: false },
        { text: "ATC", sortable: false }
      ],

      // Des City	Zone			Service Type	Payment Type
      //	Amt to Collect	Delivery Fee		Others Fee	Advanced	Net Amt
      excelHeaders: {
        "Pickup Date": "pickup_date",
        "Pickup No": "pickup_invoice",
        "Inv No": "voucher_no",
        "Sender Type": "sender_type",
        "Original City": "sender_city.name",
        "Send Name": "sender",
        "Sender Mobile": "phones",
        Receiver: "receiver.name",
        "Receiver Phone": "receiver.phone",
        City: "receiver_city.name",
        "Zone/Ward": "receiver_zone.name",
        Address: "receiver.address",
        "Payment Type": "payment_type.name",
        "ATC Sender": "amount_to_collect_sender",
        "ATC Receiver": "amount_to_collect_receiver",
        "Delivery Fee": "total_delivery_amount",
        "Bus Station": "sender_bus_station",
        Gate: "sender_gate",
        "Bus Fee": "total_bus_fee",
        Note: "remark"
      }
    };
  },
  created() {
    document.addEventListener("focusin", this.focusChanged);
  },
  beforeDestroy() {
    document.removeEventListener("focusin", this.focusChanged);
  },
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios, $api } = context.app;

    const requestId = context.params.id;
    let { status, data } = await $api.getPickupsDetails($axios, jwt, requestId);
    if (!handleStatusInAsyncData({ status, context })) return;
    const {
      metas,
      gates,
      zones,
      staffs,
      cities,
      paymentTypes,
      stations,
      logStatuses,
      callStatuses,
      storeStatuses,
      deliveryStatuses
    } = await getAllLocalForage();
    const pickup_price = parseInt(
      metas.find(({ key }) => key === "pickup_price").value,
      10
    );
    const currentCityId = parseInt(
      metas.find(({ key }) => key === "city").value
    );
    const currentZoneId = parseInt(
      metas.find(({ key }) => key === "zone").value
    );
    const {
      senderStations,
      receiverStations
    } = await helpers.getClassifiedStations();
    const deliveriesValues = deliveryStatuses.map(({ status_mm }) => status_mm);
    const paymentTypesValues = paymentTypes.map(({ name }) => name);
    const normalPaymentTypes = helpers.getNormalPaymentTypes({
      paymentTypes,
      isCustomer: data.sender_type === "Customer"
    });
    const citiesValues = cities.map(({ name }) => name);
    const citiesD2D = cities.filter(city => city.is_available_d2d);
    const busStationsValues = stations.map(({ name }) => name);
    const foundStaff = staffs.find(({ id }) => id === data.opened_by);
    const phones = helpers.getPhones(data);
    const address = helpers.getAddress(data);
    const zone = helpers.getZone(data);
    const city = helpers.getCity(data);
    data.vouchers.forEach(voucher => {
      voucher.sender = data.sender.name;
      voucher.sender_type = data.sender_type;
      voucher.phones = phones;
      voucher.address = address;
      voucher.city = city;
      voucher.zone = zone;
      voucher.pickup_invoice = data.pickup_invoice;
      voucher.note = data.note;
      voucher.pickup_date = data.created_at;
      voucher.sender_bus_station =
        voucher.bus_station == true ? voucher.sender_bus_station.name : "";
      voucher.sender_gate =
        voucher.bus_station == true ? voucher.sender_gate.name : "";
    });

    const mappedForms = helpers.getMappedForms({ vouchers: data.vouchers });

    const { normalForms, stationForms } = helpers.cleanForms({
      mappedForms,
      cities,
      stations
    });

    let printNormalForms = helpers.cleanForms({
      mappedForms,
      cities,
      stations
    }).normalForms;
    let printStationsForms = helpers.cleanForms({
      mappedForms,
      cities,
      stations
    }).stationForms;

    data.take_pickup_fee = !!data.take_pickup_fee;
    context.store.commit("title/setTitle", "Pickup Details - Operation");
    return {
      untouchedState: null,
      snackbar: false,
      snackbarMessage: "",
      isLoading: false,
      sTable: "",
      sIndex: "",
      sType: "",
      sForm: {},
      clonedForm: null,
      editingForm: null,
      editingIndex: null,
      actionMessage: "",
      isOpenActionDialog: false,
      action: "",
      ...data,
      pickup_price,
      total_prepaid_amount: parseFloat(data.total_prepaid_amount || 0, 10),
      pickup_fee: parseFloat(data.pickup_fee || 0, 10),
      total_amount_to_collect: parseFloat(
        data.total_amount_to_collect || 0,
        10
      ),
      interpretedLogs: [],
      phones,
      address,
      zone,
      zones,
      city,
      stationForms,
      normalForms,
      busStations: stations,
      printNormalForms,
      printStationsForms,
      busStationsValues,
      citiesValues,
      cities,
      citiesD2D,
      gates,
      paymentTypes,
      callStatuses,
      logStatuses,
      staffs,
      storeStatuses,
      deliveryStatuses,
      currentCityId,
      currentZoneId,
      senderStations,
      receiverStations
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    })
  },
  components: {
    AppLoading,
    AppLog,
    AppCell,
    Info,
    ShortKeys,
    NormalTableHeaders,
    StationTableHeaders,
    CostInformation
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    getReceiverCities() {
      return this.cities.filter(({ id }) => id !== this.currentCityId);
    },
    getStoreStatuses() {
      return this.storeStatuses.filter(({ id }) => id === 1 || id === 2);
    },
    getNormalVoucherPaymentTypes() {
      if (this.sender_type === "Customer") {
        return this.paymentTypes.filter(
          paymentType => paymentType.id === 9 || paymentType.id === 3
        );
      } else {
        return this.paymentTypes.filter(
          paymentType =>
            paymentType.id === 1 ||
            paymentType.id === 2 ||
            paymentType.id === 3 ||
            paymentType.id === 4 ||
            paymentType.id === 9 ||
            paymentType.id === 10
        );
      }
    },
    getStationVoucherPaymentTypes({ form }) {
      if (this.sender_type === "Customer") {
        if (form.isDebit) {
          return this.paymentTypes.filter(
            paymentType => paymentType.id === 7 || paymentType.id === 8
          );
        } else {
          return this.paymentTypes.filter(paymentType => paymentType.id === 8);
        }
      } else {
        if (form.isDebit) {
          return this.paymentTypes.filter(
            paymentType =>
              paymentType.id === 5 ||
              paymentType.id === 6 ||
              paymentType.id === 7 ||
              paymentType.id === 8
          );
        } else {
          return this.paymentTypes.filter(
            paymentType => paymentType.id === 6 || paymentType.id === 8
          );
        }
      }
    },
    getVoucherNumberAndStatus(voucher) {
      if (!voucher.voucher_no) return "";
      if (!voucher.is_closed) {
        return voucher.voucher_no + " - OPEN";
      } else if (voucher.is_closed) {
        return voucher.voucher_no + " - CLOSED";
      }
    },
    async closePickup() {
      if (!this.opened_by) return this.showSnackbar("Pickup need to assign.");
      const { id, jwt, $axios } = this;
      if (this.normalForms.length === 0 && this.stationForms.length === 0)
        return this.showSnackbar(
          "Pickup need to have at least one voucher to close."
        );
      const { data, status, message } = (await this.$api.closePickup({
        id,
        jwt,
        $axios
      })).data;
      const isSuccess = handleStatus({
        status,
        message,
        that: this,
        successMessage: "Successfully closed pickup."
      });
      const mappedForms = helpers.getMappedForms({
        vouchers: data.vouchers
      });
      const { normalForms, stationForms } = helpers.cleanForms({
        mappedForms,
        cities: this.cities,
        stations: this.busStations
      });
      this.normalForms = normalForms;
      this.stationForms = stationForms;
      this.is_closed = data.is_closed;
    },
    async importVouchers(vouchers) {
      let vouchersData = [];
      vouchers.splice(0, 1);
      vouchers.forEach(voucher => {
        let voucherObj = {};
        voucherObj.pickup_id = this.id;
        voucherObj.sender_city_id = this.sender.city.id;
        voucherObj.sender_zone_id =
          this.sender_type === "Merchant"
            ? this.sender_associate.zone.id
            : this.sender.zone.id;
        voucherObj.receiver_name = voucher[0];
        voucherObj.receiver_phone = voucher[1];
        voucherObj.total_item_price = voucher[2];
        voucherObj.remark = voucher[3] || "";
        // voucherObj.receiver_city = voucher[4];
        // voucherObj.receiver_zone = voucher[5];
        voucherObj.receiver_address = voucher[4] || "";
        voucherObj.payment_type_id = 1;
        voucherObj.bus_station = 0;
        vouchersData.push(voucherObj);
      });
      let { message, status } = await this.$api.importVouchers({
        jwt: this.jwt,
        $axios: this.$axios,
        vouchers: vouchersData
      });
      if (status != 1) message = "Failed!";
      handleStatus({
        status,
        message,
        that: this,
        successMessage: "Successfully Imported."
      });
      this.$emit("imported");
      this.$router.go();
    },
    async showHistory() {
      const {
        data,
        status,
        message
      } = await this.$api.getPickupDetailsHistories({
        axios: this.$axios,
        jwt: this.jwt,
        id: this.id
      });
      const rawHistories = [
        ...data.pickup_histories,
        ...data.voucher_histories
      ];
      const results = interpretLog({
        logs: rawHistories,
        logStatuses: this.logStatuses,
        staffs: this.staffs,
        deliveryStatuses: this.deliveryStatuses,
        storeStatuses: this.storeStatuses
      });
      this.interpretedLogs = results;
    },
    onChangeReceiverCity({ form, id }) {
      const receiverStations = this.busStations.filter(
        station => station.city.id === id
      );
      form.receiverStations = receiverStations;
    },
    getReceiverCityName(form) {
      try {
        return form.receiver_city.name;
      } catch (error) {
        return "";
      }
    },
    async onPickupFeeUpdate({ flag }) {
      let value;
      if (flag === undefined) value = this.take_pickup_fee ? 1 : 0;
      else value = flag;
      const { data, status, message } = (await this.$api.updatePickupFee({
        axios: this.$axios,
        pickupId: this.id,
        jwt: this.jwt,
        take_pickup_fee: value
      })).data;
      const isSuccess = handleStatus({
        status,
        message,
        that: this,
        successMessage: "Successfully updated."
      });
      if (!isSuccess) {
        this.take_pickup_fee = !value;
      } else {
        this.take_pickup_fee = !!value;
      }
      if (this.take_pickup_fee) {
        this.pickup_fee = this.pickup_price;
      } else {
        this.pickup_fee = 0;
      }
    },
    onClickEdit(event) {
      event.stopPropagation();
      this.onUnlockForm();
    },
    onClickDel(event) {
      event.stopPropagation();
      this.onDelRow();
    },
    onDelRow() {
      const { sTable, sIndex } = this;
      const forms = sTable === "normal" ? this.normalForms : this.stationForms;
      const formToDel = forms[sIndex];
      if (!formToDel.id) return forms.splice(sIndex, 1);
      this.askActionConfirmation("del");
    },
    focusChanged(event) {
      const { name } = event.target;
      if (!name) return;
      const names = name.split("-");
      if (names.length !== 3) {
        this.status = "";
        this.sIndex = null;
        this.sType = "";
        this.sForm = null;
        return;
      }
      const sTable = names[0];
      const sIndex = names[1];
      const sType = names[2];
      const sForm =
        sTable === "normal"
          ? this.normalForms[sIndex]
          : this.stationForms[sIndex];
      this.sTable = sTable;
      this.sIndex = parseInt(sIndex, 10);
      this.sType = sType;
      this.sForm = sForm;
    },
    async cancelForm({ form, index, forms }) {
      if (form.id) {
        if (form.isBusStation) {
          const {
            receiver,
            total_item_price,
            payment_type,
            amount_to_collect_sender,
            amount_to_collect_receiver,
            call_status,
            store_status
          } = this.untouchedState;
          form.receiver = receiver;
          form.total_item_price = total_item_price;
          form.payment_type = payment_type;
          form.amount_to_collect_sender = amount_to_collect_sender;
          form.amount_to_collect_receiver = amount_to_collect_receiver;
          form.call_status = call_status;
          form.store_status = store_status;
        } else {
          const {
            receiver,
            receiver_city,
            sender_bus_station,
            receiver_bus_station,
            // receiver_gate,
            sender_gate,
            total_item_price,
            payment_type,
            amount_to_collect_sender,
            amount_to_collect_receiver,
            call_status,
            store_status
          } = this.untouchedState;
          form.receiver = receiver;
          form.receiver_city = receiver_city;
          form.sender_bus_station = sender_bus_station;
          form.receiver_bus_station = receiver_bus_station;
          // form.receiver_gate = receiver_gate;
          form.sender_gate = sender_gate;
          form.total_item_price = total_item_price;
          form.payment_type = payment_type;
          form.amount_to_collect_sender = amount_to_collect_sender;
          form.amount_to_collect_receiver = amount_to_collect_receiver;
          form.call_status = call_status;
          form.store_status = store_status;
        }
        form.isLocked = true;
        this.$forceUpdate();
      } else {
        forms.splice(index, 1);
      }
    },
    async createNewNormalVoucher() {
      if (this.is_closed) return;
      const isAnyUnlocked = this.checkUnlockedRow();
      if (isAnyUnlocked) {
        this.showSnackbar("Another row is being edited.");
        return;
      }
      const { city, zone, cities } = this;
      this.normalForms.unshift({
        receiver: { name: "", phone: "", address: "" },
        call_status: 1,
        store_status: 1,
        is_closed: false,
        total_item_price: 0
      });
      this.editingIndex = 0;
      await this.$nextTick();
      this.$refs["normal-0-receiverName"][0].focus();
    },
    async createNewBusStationVoucher() {
      if (this.is_closed) return;
      const isAnyUnlocked = this.checkUnlockedRow();
      if (isAnyUnlocked)
        if (isAnyUnlocked) {
          this.showSnackbar("Another row is being edited.");
          return;
        }
      this.stationForms.unshift({
        receiver: { name: "", phone: "", address: "" },
        call_status: 1,
        store_status: 1,
        receiverStationNames: [],
        is_closed: false,
        isReceiverNameError: null,
        isReceiverPhoneError: null,
        isReceiverCityError: null,
        isSenderBusStationError: null,
        isReceiverBusStationError: null,
        isReceiverGateError: null,
        isPaymentTypeError: null,
        isTotalItemPriceError: null,
        total_item_price: 0
      });
      this.editingIndex = 0;
      await this.$nextTick();
      this.$refs["station-0-receiverName"][0].focus();
    },
    async submitForm() {
      const { sTable, sForm, sIndex } = this;
      let isSuccess;
      if (sTable === "normal") {
        const form = sForm;
        isSuccess = await this.submitNormalForm({ form, index: sIndex });
      } else if (sTable === "station") {
        isSuccess = await this.submitStationForm({
          form: sForm,
          index: sIndex
        });
      }
      return isSuccess;
    },
    checkIfAnyRowIsUnlocked() {
      const forms = [...this.normalForms, ...this.stationForms];
      let isUnlocked = false;
      forms.forEach(form => {
        if (!form.isLocked) isUnlocked = true;
      });
      return isUnlocked;
    },
    async onSubmit() {
      const { sForm, sIndex, sTable } = this;

      const forms = [...this.normalForms, ...this.stationForms];
      if (forms.length === 0) return;
      if (!this.checkIfAnyRowIsUnlocked()) return;

      let isSuccess = false;
      isSuccess = await this.submitForm();
      if (isSuccess) this.reset();
    },
    validateNormalForm({ form }) {
      if (
        !form.receiver.name ||
        !form.receiver.phone ||
        !form.receiver.address ||
        !form.receiver_city ||
        !form.receiver_zone ||
        !form.payment_type
      )
        // return isFreeError
        return false;
      return true;
    },
    buildNormalPayload({ form, pickup_id }) {
      let {
        id = null,
        payment_type,
        receiver,
        receiver_city,
        receiver_zone,
        total_item_price,
        parcels,
        call_status,
        store_status,
        global_scale,
        weight
      } = form;
      let global_scale_id = 1;
      if (parcels) {
        parcels.forEach(parcel => {
          parcel.global_scale_id = parcel.global_scale.id;
        });
      }
      if (global_scale <= 20) {
        global_scale_id = 1;
      } else if (global_scale <= 25) {
        global_scale_id = 2;
      } else if (global_scale <= 30) {
        global_scale_id = 3;
      } else if (global_scale <= 35) {
        global_scale_id = 4;
      } else if (global_scale <= 40) {
        global_scale_id = 5;
      } else if (global_scale <= 45) {
        global_scale_id = 6;
      } else if (global_scale <= 50) {
        global_scale_id = 7;
      } else if (global_scale <= 55) {
        global_scale_id = 8;
      } else if (global_scale <= 60) {
        global_scale_id = 9;
      } else if (global_scale <= 65) {
        global_scale_id = 10;
      } else if (global_scale <= 70) {
        global_scale_id = 11;
      } else if (global_scale <= 75) {
        global_scale_id = 12;
      } else if (global_scale <= 80) {
        global_scale_id = 13;
      } else if (global_scale <= 85) {
        global_scale_id = 14;
      } else if (global_scale <= 90) {
        global_scale_id = 15;
      } else if (global_scale <= 95) {
        global_scale_id = 16;
      } else if (global_scale <= 100) {
        global_scale_id = 17;
      } else if (global_scale <= 105) {
        global_scale_id = 18;
      } else if (global_scale <= 110) {
        global_scale_id = 19;
      } else if (global_scale <= 115) {
        global_scale_id = 20;
      } else if (global_scale <= 120) {
        global_scale_id = 21;
      }
      return {
        pickup_id,
        id,
        parcels,
        bus_station: 0,
        sender_city_id: this.currentCityId,
        sender_zone_id: this.currentZoneId,
        receiver_id: receiver.id,
        receiver_name: receiver.name,
        receiver_phone: receiver.phone,
        receiver_address: receiver.address,
        payment_type_id: getId(payment_type),
        receiver_city_id: getId(receiver_city),
        receiver_zone_id: getId(receiver_zone),
        call_status_id: getId(call_status),
        store_status_id: getId(store_status),
        total_item_price,
        global_scale_id,
        weight
      };
    },
    async updateVoucherStatus({ form }) {
      const { call_status, store_status, receiver } = form;
      const call_status_id = getId(call_status);
      const store_status_id = getId(store_status);
      const receiver_id = getId(receiver.id);
      const receiver_name = receiver.name;
      const receiver_phone = receiver.phone;
      const receiver_address = receiver.address;
      const payload = {
        call_status_id,
        store_status_id,
        receiver_id,
        receiver_name,
        receiver_phone,
        receiver_address
      };
      const { data, status, message } = await this.$api.updateVoucherStatus({
        jwt: this.jwt,
        $axios: this.$axios,
        id: form.id,
        payload
      });
      this.isLoading = false;
      handleStatus({
        status,
        message,
        that: this,
        successMessage: "Succeed"
      });
      if (status !== 1) {
        this.cancelForm({ form });
      } else {
        form.isLocked = true;
        form.call_status = this.callStatuses.find(
          ({ id }) => id === call_status_id
        );
        form.store_status = this.storeStatuses.find(
          ({ id }) => id === store_status_id
        );
      }
    },
    async submitNormalForm({ form, index }) {
      if (this.sTable !== "normal" || this.isLoading) return;
      if (this.isLoading) return;
      if (form.id && form.is_closed) {
        this.isLoading = true;
        return this.updateVoucherStatus({ form });
      }

      const isFreeError = this.validateNormalForm({ form });
      if (!isFreeError) return;

      const pickup_id = this.id;
      const payload = this.buildNormalPayload({ form, pickup_id });
      this.isLoading = true;
      const { data, status, message } = (await this.$api.createUpdateVoucher(
        this,
        {
          payload
        }
      )).data;
      this.isLoading = false;
      handleStatus({
        status,
        message,
        that: this,
        successMessage: "Succeed"
      });
      if (status !== 1) return;
      if (this.normalForms.length + this.stationForms.length === 3) {
        this.onPickupFeeUpdate({ flag: 0 });
      }
      if (status === 1) {
        this.updateForm({ index, data, tableType: "normal" });
        this.total_prepaid_amount = parseInt(
          data.pickup.total_prepaid_amount,
          10
        );
        return true;
      }
      return false;
    },
    updateForm({ index, data, tableType }) {
      if (tableType === "normal") {
        this.normalForms.splice(index, 1, {
          ...data,
          // receiver_zone: helpers.insertZoneDefaultValue(data.receiver_zone),
          isLocked: true
        });
      } else if (tableType === "station") {
        this.stationForms.splice(index, 1, {
          ...data,
          isLocked: true
        });
      }
    },
    buildStationPayload({ form, pickup_id }) {
      let {
        id = null,
        payment_type,
        receiver,
        receiver_bus_station,
        receiver_gate,
        sender_bus_station,
        sender_gate,
        total_item_price,
        parcels,
        call_status,
        receiver_city,
        store_status,
        global_scale,
        weight
      } = form;
      let global_scale_id = 1;
      if (parcels) {
        parcels.forEach(parcel => {
          parcel.global_scale_id = parcel.global_scale.id;
        });
      }
      if (global_scale <= 20) {
        global_scale_id = 1;
      } else if (global_scale <= 25) {
        global_scale_id = 2;
      } else if (global_scale <= 30) {
        global_scale_id = 3;
      } else if (global_scale <= 35) {
        global_scale_id = 4;
      } else if (global_scale <= 40) {
        global_scale_id = 5;
      } else if (global_scale <= 45) {
        global_scale_id = 6;
      } else if (global_scale <= 50) {
        global_scale_id = 7;
      } else if (global_scale <= 55) {
        global_scale_id = 8;
      } else if (global_scale <= 60) {
        global_scale_id = 9;
      } else if (global_scale <= 65) {
        global_scale_id = 10;
      } else if (global_scale <= 70) {
        global_scale_id = 11;
      } else if (global_scale <= 75) {
        global_scale_id = 12;
      } else if (global_scale <= 80) {
        global_scale_id = 13;
      } else if (global_scale <= 85) {
        global_scale_id = 14;
      } else if (global_scale <= 90) {
        global_scale_id = 15;
      } else if (global_scale <= 95) {
        global_scale_id = 16;
      } else if (global_scale <= 100) {
        global_scale_id = 17;
      } else if (global_scale <= 105) {
        global_scale_id = 18;
      } else if (global_scale <= 110) {
        global_scale_id = 19;
      } else if (global_scale <= 115) {
        global_scale_id = 20;
      } else if (global_scale <= 120) {
        global_scale_id = 21;
      }
      return {
        pickup_id,
        id,
        bus_station: 1,
        receiver_id: receiver.id,
        receiver_name: receiver.name,
        receiver_phone: receiver.phone,
        receiver_address: receiver.address,
        payment_type_id: getId(payment_type),
        receiver_bus_station_id: getId(receiver_bus_station),
        // receiver_gate_id: getId(receiver_gate),
        sender_gate_id: getId(sender_gate),
        sender_bus_station_id: getId(sender_bus_station),
        call_status_id: getId(call_status),
        store_status_id: getId(store_status),
        receiver_city_id: getId(receiver_city),
        total_item_price,
        parcels,
        global_scale_id,
        weight
      };
    },
    validateStationForm({ form }) {
      if (
        !form.receiver.name ||
        !form.receiver_city ||
        !form.sender_bus_station ||
        !form.receiver_bus_station ||
        !form.sender_gate ||
        !form.payment_type
      )
        return false;
      return true;
    },
    async submitStationForm({ form, index }) {
      if (this.sTable !== "station") return;
      if (this.isLoading) return;

      if (form.id && form.is_closed) {
        this.isLoading = true;
        return this.updateVoucherStatus({ form });
      }

      const isFreeError = this.validateStationForm({ form });
      if (!isFreeError) return;

      this.isLoading = true;
      const pickup_id = this.id;
      const payload = this.buildStationPayload({ form, pickup_id });
      const { data, status, message } = (await this.$api.createUpdateVoucher(
        this,
        {
          payload
        }
      )).data;
      handleStatus({
        status,
        message,
        that: this,
        successMessage: "Succeed."
      });
      if (this.normalForms.length + this.stationForms.length === 3) {
        this.onPickupFeeUpdate({ flag: 0 });
      }
      this.isLoading = false;
      if (status === 1) {
        this.updateForm({ index, data, tableType: "station" });
        this.total_prepaid_amount = parseInt(
          data.pickup.total_prepaid_amount,
          10
        );
        return true;
      }
      return false;
    },
    onChangeCity({ id, form }) {
      const foundCity = this.cities.find(city => city.id === id);
      if (!foundCity) return;
      form.receiverZones = foundCity.zones.filter(zone => zone.is_deliver);
    },
    onChangeStation({ id, form, flag }) {
      const foundStation = this.busStations.find(station => station.id === id);
      if (flag === "receiver") {
        form.receiverGates = foundStation.gates;
        const intersectionGates = _.intersectionBy(
          form.senderGates,
          form.receiverGates,
          "bus.id"
        );
        form.intersectionGates = intersectionGates;
      } else if (flag === "sender") {
        form.senderGates = foundStation.gates;
        const intersectionGates = _.intersectionBy(
          form.senderGates,
          form.receiverGates,
          "bus.id"
        );
        form.intersectionGates = intersectionGates;
        // form.intersectionGates = form.senderGates;
      }
    },
    onChangeReceiverGate({ id, form }) {
      const foundGate = this.gates.find(gate => gate.id === id);
      form.isDebit = !!foundGate.gate_debit;
    },
    onChangeSenderGate({ id, form }) {
      const foundGate = this.gates.find(gate => gate.id === id);
      form.isDebit = !!foundGate.gate_debit;
    },
    nextRow() {
      if (!this.sIndex && !this.sTable) {
        this.$refs["normal-0-rowButton"][0].focus();
      }
      const refKeys = Object.keys(this.$refs);
      const currentRefKey = `${this.sTable}-${this.sIndex}-rowButton`;
      const currentRefKeyIndex = refKeys.findIndex(
        key => key === currentRefKey
      );
      const nextRefKey = refKeys[currentRefKeyIndex + 1];
      if (!nextRefKey) return;
      if (this.$refs[nextRefKey].length === 0) {
        const secNextRefKey = refKeys[currentRefKeyIndex + 2];
        try {
          this.$refs[secNextRefKey][0].focus();
        } catch (error) {
          return;
        }
      } else {
        try {
          this.$refs[nextRefKey][0].focus();
        } catch (error) {
          return;
        }
      }
    },
    previousRow() {
      if (!this.sIndex && !this.sTable) {
        this.$refs["normal-0-rowButton"][0].focus();
      }
      const refKeys = Object.keys(this.$refs);
      const currentRefKey = `${this.sTable}-${this.sIndex}-rowButton`;
      const currentRefKeyIndex = refKeys.findIndex(
        key => key === currentRefKey
      );
      const nextRefKey = refKeys[currentRefKeyIndex - 1];
      if (!nextRefKey) return;
      if (this.$refs[nextRefKey].length === 0) {
        const secNextRefKey = refKeys[currentRefKeyIndex - 2];
        try {
          this.$refs[secNextRefKey][0].focus();
        } catch (error) {
          return;
        }
      } else {
        try {
          this.$refs[nextRefKey][0].focus();
        } catch (error) {
          return;
        }
      }
    },
    reset() {
      this.actionMessage = "";
      this.editingIndex = null;
      this.editingForm = null;
      this.clonedForm = null;
      this.isOpenActionDialog = false;
      this.lockRows();
    },
    async delRow() {
      const { sIndex, jwt } = this;
      const forms =
        this.sTable === "normal" ? this.normalForms : this.stationForms;
      const id = forms[this.sIndex].id;
      const axios = this.$axios;
      const {
        status,
        message,
        data,
        total_prepaid_amount
      } = (await this.$api.delVoucher({
        axios,
        jwt,
        id
      })).data;
      if (status === 1) {
        forms.splice(sIndex, 1);
        this.total_prepaid_amount = parseInt(total_prepaid_amount, 10);
      }
      if (this.normalForms.length + this.stationForms.length === 2) {
        this.onPickupFeeUpdate({ flag: 1 });
      }
      this.isOpenActionDialog = false;
    },
    cancelAction() {
      this.isOpenActionDialog = false;
    },
    submitAction() {
      const { action } = this;
      if (action === "edited") {
        this.proceedEditedAction();
      } else if (action === "del") {
        this.delRow();
      }
    },
    showActionConfirmation(message) {
      this.actionMessage = message;
      this.isOpenActionDialog = true;
    },
    askActionConfirmation(action) {
      if (action === "edited") {
        this.action = "edited";
        this.showActionConfirmation("Another row is being edited. 1");
      } else if (action === "del") {
        this.action = "del";
        this.showActionConfirmation("Delete voucher confirmation.");
      }
    },
    onLockRow() {
      const { sTable, sIndex } = this;
      const from =
        sTable === "normal"
          ? this.normalForms[sIndex]
          : this.stationForms[sIndex];
    },
    async unlockForm() {
      const { sTable, sIndex } = this;
      let cellToFocus = null;
      let form = null;
      this.lockRows();
      if (sTable === "normal") {
        form = this.normalForms[sIndex];
        if (!form.receiverZones) {
          form.receiverZones = this.zones.filter(
            z => z.city.id == form.receiver_city.id
          );
        }
      } else if (sTable === "station") {
        form = this.stationForms[sIndex];
        if (!form.receiverStations) {
          form.receiverStations = this.busStations.filter(
            s => s.city.id == form.receiver_city.id
          );
        }
        this.onChangeStation({
          id: form.sender_bus_station.id,
          form,
          flag: "sender"
        });
        this.onChangeStation({
          id: form.receiver_bus_station.id,
          form,
          flag: "receiver"
        });
        this.onChangeSenderGate({
          id: form.sender_gate.id,
          form
        });
      }
      const untouchedState = _.cloneDeep(form);
      this.untouchedState = untouchedState;
      form.isLocked = false;
    },
    lockRows() {
      for (const form of this.normalForms) {
        form.isLocked = true;
      }
      for (const form of this.stationForms) {
        form.isLocked = true;
      }
    },
    onUnlockForm() {
      const isUnlockedAny = this.checkIfAnyRowIsUnlocked();
      if (isUnlockedAny)
        return this.showSnackbar(
          "Another row is being edited. Please close it first."
        );
      this.unlockForm();
    },
    showSnackbar(message) {
      this.snackbarMessage = message;
      this.snackbar = true;
    },
    checkUnlockedRow() {
      for (const form of this.normalForms) {
        if (!form.isLocked) return true;
      }
      for (const form of this.stationForms) {
        if (!form.isLocked) return true;
      }
      return false;
    },
    goDetails(voucherId) {
      this.$router.push("/vouchers/details?voucherId=" + voucherId);
    }
  },
  mounted() {
    this.setNavigationShow(true);
    if (window.history.length > 1) this.setNavigationUrl("history");
    else this.setNavigationShow(false);
  }
};
</script>

<style scoped>
#printPickup {
  display: none;
}
@media print {
  button,
  .v-btn,
  .no-print {
    display: none;
  }
  #printPickup {
    display: block !important;
  }
}
</style>
