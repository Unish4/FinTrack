export const formatCurrency = (amount, currency = "NPR") => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(0);
  }
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(dateString);
};
