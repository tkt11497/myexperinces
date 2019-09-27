import localforage from "localforage";
import validator from "validator";

export const getAllLocalForage = async () => {
  const records = await Promise.all([
    localforage.getItem("jwt"),
    localforage.getItem("stored:busStations"),
    localforage.getItem("stored:callStatuses"),
    localforage.getItem("stored:cities"),
    localforage.getItem("stored:delegateDurations"),
    localforage.getItem("stored:deliveryStatuses"),
    localforage.getItem("stored:gates"),
    localforage.getItem("stored:globalScales"),
    localforage.getItem("stored:logStatuses"),
    localforage.getItem("stored:merchants"),
    localforage.getItem("stored:metas"),
    localforage.getItem("stored:paymentTypes"),
    localforage.getItem("stored:staffs"),
    localforage.getItem("stored:storeStatuses"),
    localforage.getItem("stored:zones"),
    localforage.getItem("stored:user")
  ]);

  const deliveryDutyStaffs = records[12].filter(
    staff => staff.role === 5 || staff.department.id === 5
  );
  const customerDutyStaffs = records[12].filter(
    staff => staff.role === 4 || staff.department.id === 4
  );
  const delegateDurations = records[4].map(duration => ({
    id: duration.id,
    name: duration.time + " " + duration.value
  }));

  return {
    // jwt: records[0],
    delegateDurations,
    deliveryDutyStaffs,
    customerDutyStaffs,
    stations: records[1],
    callStatuses: records[2],
    cities: records[3],
    deliveryStatuses: records[5],
    gates: records[6],
    globalScales: records[7],
    logStatuses: records[8],
    merchants: records[9],
    metas: records[10],
    paymentTypes: records[11],
    staffs: records[12],
    storeStatuses: records[13],
    zones: records[14],
    user: records[15]
  };
};

export const interpretLog = ({
  logs,
  logStatuses,
  staffs,
  deliveryStatuses,
  storeStatuses
}) => {
  return logs.map((log, index) => {
    if (log.next) {
      log.next = validator.isNumeric(log.next) ?
        parseInt(log.next, 10) :
        log.next;
    }
    if (log.previous) {
      log.previous = validator.isNumeric(log.previous) ?
        parseInt(log.previous, 10) :
        log.previous;
    }
    const foundLog = logStatuses.find(({
      id
    }) => id === log.log_status_id);
    const createdBy = staffs.find(({
      id
    }) => id === log.created_by);
    let next = log.next;
    let previous = log.previous;
    if (log.log_status_id === 10) {
      next = staffs.find(({
        id
      }) => id === next).username;
      previous = staffs.find(({
        id
      }) => id === previous).username;
    } else if (log.log_status_id === 1) {
      next = deliveryStatuses.find(({
        id
      }) => id === next).status;
      previous = deliveryStatuses.find(({
        id
      }) => id === previous).status;
    } else if (log.log_status_id === 3) {
      next = storeStatuses.find(({
        id
      }) => id === next).status;
      previous = storeStatuses.find(({
        id
      }) => id === previous).status;
    }
    const modifiedLog = {
      ...log,
      next,
      previous,
      logStatus: foundLog,
      createdBy: createdBy.username
    };
    return modifiedLog;
  });
};

const openSnackBar = (that, snackbarMessage) => {
  that.snackbarMessage = snackbarMessage;
  that.snackbar = true;
};

export const handleStatus = ({
  status,
  message,
  that,
  successMessage
}) => {
  if (status === 1) {
    openSnackBar(that, successMessage);
    return true;
  } else if (status === 2) {
    typeof message === "object" ? openSnackBar(that, Object.values(message)[0][0]) : openSnackBar(that, message);
    return false;
  } else if (status === 3) {
    that.$router.push("/");
    return false;
  } else if (status === 4) {
    openSnackBar(that, message);
    return false;
  }
};

export const handleStatusInAsyncData = async ({
  status,
  context
}) => {
  if (status !== 1) {
    await localforage.clear();
    context.redirect("/login");
    return false;
  }
  return true;
};

export const closeFormDialog = that => {
  that.isFormOpenDialog = false;
  that.$validator.reset();
};

export const closeDeleteDialog = that => {
  that.isDeleteDialogOpen = false;
};

export const onDelete = (that, item) => {
  that.deletingId = item.id;
  that.isDeleteDialogOpen = true;
};
export const onClose = (that, item) => {
  that.closingId = item.id;
  that.isCloseDialogOpen = true;
};
export const onCreate = that => {
  that.$validator.reset();
  that.mode = "new";
  that.isFormOpenDialog = true;
  that.form = {};
};

export const clean = that => {
  that.form = {};
};

export const onEdit = (that, item) => {
  that.mode = "edit";
  that.form = {
    ...item
  };
  that.$validator.reset();
  that.isFormOpenDialog = true;
  that.editingId = item.id;
};

export const pagination = (that, api_url, event) => {
  let orderBy = event.descending ? "desc" : "asc";
  that.search = that.search == null ? "" : that.search;
  event.sortBy = event.sortBy == null ? "" : event.sortBy;
  let url =
    api_url +
    "&search=" +
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
};

export const setPaginationData = (that, data, links, meta) => {
  that.gates = data;
  that.pagination.totalItems = meta.total;
  that.pagination.rowsPerPage = meta.per_page;
  that.pagination.prev = links.prev;
  that.pagination.next = links.next;
  that.pagination.current_page = meta.current_page;
  that.loading = false;
};

export const getId = field => {
  try {
    if (!field) return null;
    if (typeof field === "number") return field;
    return field.id;
  } catch (error) {
    return null;
  }
};