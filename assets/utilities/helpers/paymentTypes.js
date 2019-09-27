export const addStatusToPaymentType = paymentType => {
  if (paymentType.id === 8 || paymentType.id === 9 || paymentType.id === 10) {
    return { ...paymentType, status: "Pre-paid" };
  } else if (paymentType.id === 6 || paymentType.id === 7) {
    return { ...paymentType, status: "Partial-paid" };
  } else {
    return { ...paymentType, status: "Post-paid" };
  }
};

export const mapPaymentTypes = paymentTypes => {
  return paymentTypes.map(paymentType => {
    return addStatusToPaymentType(paymentType);
  });
};
