import { sp } from "@pnp/sp/presets/all";
import { IProforma } from './Module';

export const fetchItems = async (listName: string, proformaId: number) => {
  const items = await sp.web.lists.getByTitle(listName).items
    .select("ID", "ItemName", "itemNumber", "TotalPrice", "PricePerUnit", "Modified", "ProformaID/ID", "ProformaID/ProformaNumber")
    .expand("ProformaID")
    .filter(`ProformaID/ID eq ${proformaId}`)
    .orderBy("Modified", true)
    .top(5)
    .get();

  return items.map(item => ({
    ...item,
    TotalPrice: parseFloat(item.TotalPrice.toString()),
    Modified: new Date(item.Modified)
  }));
};

export const updateItem = async (listName: string, itemId: number, updatedItem: { ItemName: string, PricePerUnit: number, itemNumber: number }) => {
  await sp.web.lists.getByTitle(listName).items.getById(itemId).update(updatedItem);
};

export const addItem = async (listName: string, newItem: { ItemName: string, PricePerUnit: number, itemNumber: number, ProformaIDId: number }) => {
  return await sp.web.lists.getByTitle(listName).items.add(newItem);
};

export const deleteItems = async (listName: string, itemIds: number[]) => {
  await Promise.all(
    itemIds.map(itemId => sp.web.lists.getByTitle(listName).items.getById(itemId).delete())
  );
};
