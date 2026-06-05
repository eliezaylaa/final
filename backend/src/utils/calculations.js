const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return (new Date(checkOut) - new Date(checkIn)) / 3600000;
};

const calculatePay = (hours, salary) => {
  return hours * salary;
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const toStripeAmount = (total) => {
  return Math.round(total * 100);
};

module.exports = {
  calculateHours,
  calculatePay,
  calculateTotal,
  toStripeAmount,
};
