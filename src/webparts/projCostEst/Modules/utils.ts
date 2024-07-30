export const validateNewItem = (newItem: { ItemName: string, PricePerUnit: number, itemNumber: number }): boolean => {
  if (!newItem.ItemName.trim()) {
    console.error("Item Name is required");
    return false;
  }
  if (newItem.PricePerUnit <= 0) {
    console.error("Price Per Unit must be greater than 0");
    return false;
  }
  if (newItem.itemNumber <= 0) {
    console.error("Item Number must be greater than 0");
    return false;
  }
  return true;
};

export const handleError = (error: any, message: string) => {
  console.error(message, error);
};
