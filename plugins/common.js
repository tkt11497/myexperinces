import Vue from "vue";
import MultiFiltersPlugin from "@/assets/utilities/helpers/MultiFilters";

Vue.use(MultiFiltersPlugin);
Vue.mixin({
  methods: {
    openSnackBar(that, snackbarMessage) {
      that.snackbarMessage = snackbarMessage;
      that.snackbar = true;
    },
    handleStatusInAsyncData({
      status,
      message,
      that,
      successMessage = "Success"
    }) {
      if (status === 1) {
        openSnackBar(that, successMessage);
        return true;
      } else if (status === 2) {
        openSnackBar(that, message);
        return false;
      } else if (status === 3) {
        that.$router.push("/");
        return false;
      }
    },
    handleStatus({
      status,
      message,
      that,
      successMessage
    }) {
      if (status === 1) {
        that.openSnackBar(that, successMessage);
      } else if (status === 2) {
        typeof message === "object" ? that.openSnackBar(that, Object.values(message)[0][0]) : that.openSnackBar(that, message);
      } else if (status === 3) {
        that.$router.push("/");
        return false;
      }
    },
    closeFormDialog(that) {
      that.isFormOpenDialog = false;
      that.$validator.reset();
    },
    closeDeleteDialog(that) {
      that.isDeleteDialogOpen = false;
    },
    async delete(that, api, successMessage) {
      const {
        data,
        status,
        message
      } = (await api.deleteGates(that)).data;
      if (status === 1) {
        const foundIndex = that.gates.findIndex(
          gate => gate.id === that.deletingId
        );
        that.gates.splice(foundIndex, 1);
      }
      that.handleStatus({
        status,
        message,
        that,
        successMessage
      });
      that.closeDeleteDialog(that);
    },
    onDelete(that, item) {
      that.deletingId = item.id;
      that.isDeleteDialogOpen = true;
    },
    paginationDataTable(that, api_url, event) {
      let orderBy = event.descending ? "desc" : "asc";
      that.search = that.search == null ? "" : that.search;
      event.sortBy = event.sortBy == null ? "" : event.sortBy;
      let url =
        api_url +
        "?search=" +
        that.search +
        "&sortBy=" +
        event.sortBy +
        "&orderBy=" +
        orderBy;

      if (that.sorting != event.sortBy) {
        that.sorting = event.sortBy;
        that.pagination.prev = null;
        return that.getDataFromApi(url);
      }

      if (event.page - that.pagination.current_page > 0) {
        if (that.pagination.next) {
          url =
            that.pagination.next +
            "&search=" +
            that.search +
            "&sortBy=" +
            event.sortBy +
            "&orderBy=" +
            orderBy;
        }
      } else {
        if (that.pagination.prev) {
          url =
            that.pagination.prev +
            "&search=" +
            that.search +
            "&sortBy=" +
            event.sortBy +
            "&orderBy=" +
            orderBy;
        }
      }
      return that.getDataFromApi(url);
    },
    paginationDataTableVouchers(that, api_url, event) {
      let query = `?voucher_invoice=${that.filters.voucher_invoice ||
        ""}&date=${that.filters.date || ""}&receiver_city=
                  ${that.filters.receiver_city || ""}&receiver_zone=${that
        .filters.receiver_zone || ""}&sender=
                  ${that.filters.sender || ""}&receiver_name=${that.filters
        .receiver_name || ""}&receiver_phone=${that.filters.receiver_phone ||
        ""}&call_status=
                  ${that.filters.call_status || ""}&delivery_status=${that
        .filters.delivery_status || ""}`;
      let query_paginate = `&voucher_invoice=${that.filters.voucher_invoice ||
          ""}&date=${that.filters.date || ""}&receiver_city=
                    ${that.filters.receiver_city || ""}&receiver_zone=${that
          .filters.receiver_zone || ""}&sender=
                    ${that.filters.sender || ""}&receiver_name=${that.filters
          .receiver_name || ""}&receiver_phone=${that.filters.receiver_phone ||
          ""}&call_status=
                    ${that.filters.call_status || ""}&delivery_status=${that
          .filters.delivery_status || ""}&sender_gate=${that
            .filters.sender_gate || ""}&payment_type=${that.filters.payment_type || ""}
            &sender_station=${that.filters.sender_station ||
              ""}&receiver_station=${that.filters.receiver_station || ""}`;
      let orderBy = event.descending ? "desc" : "asc";
      event.sortBy = event.sortBy == null ? "" : event.sortBy;
      let url =
        api_url + query +
        "&sortBy=" +
        event.sortBy +
        "&orderBy=" +
        orderBy;

      if (that.sorting != event.sortBy) {
        that.sorting = event.sortBy;
        that.pagination.prev = null;
        return that.getDataFromApi(url);
      }

      if (event.page - that.pagination.current_page > 0) {
        if (that.pagination.next) {
          url =
            that.pagination.next + query_paginate +
            "&sortBy=" +
            event.sortBy +
            "&orderBy=" +
            orderBy;
        }
      } else {
        if (that.pagination.prev) {
          url =
            that.pagination.prev +
            query_paginate +
            "&sortBy=" +
            event.sortBy +
            "&orderBy=" +
            orderBy;
        }
      }
      return that.getDataFromApi(url);
    },
    setPaginationData(that, links, meta) {
      // that.bus_drop_offs = data;
      that.pagination.totalItems = meta.total;
      that.pagination.rowsPerPage = meta.per_page;
      that.pagination.prev = links.prev;
      that.pagination.next = links.next;
      that.pagination.current_page = meta.current_page;
      that.loading = false;
    }
  }
  //   created() {
  //   }
});