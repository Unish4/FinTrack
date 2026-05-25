import { formatDate } from "./formatters.js";

export const groupTransactionsByDate = (transactions) => {
  const groups = [];
  const seen = {}; // dateLabel → index in groups array

  transactions.forEach((transaction) => {
    const dateLabel = formatDate(transaction.date);

    if (seen[dateLabel] !== undefined) {
      groups[seen[dateLabel]].transactions.push(transaction);
    } else {
      seen[dateLabel] = groups.length;
      groups.push({
        dateLabel,
        transactions: [transaction],
      });
    }
  });

  return groups;
};
