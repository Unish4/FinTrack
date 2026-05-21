export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Utilities",
  "Housing",
  "Education",
  "Personal Care",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Rental",
  "Other",
];


export const getCategoriesForType = (type) => {
  if (type === "income") return INCOME_CATEGORIES;
  if (type === "expense") return EXPENSE_CATEGORIES;
  return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
};
