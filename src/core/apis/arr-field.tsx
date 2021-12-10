import { ArrFieldApiInterface, ArrFieldInterface } from '../types';
import { commonApiPure } from './common';

export const arrFieldApiPure = (set, get, arrField: ArrFieldInterface): ArrFieldApiInterface => {
  const { setArrField } = commonApiPure(set, get);
  return {
    getObject(): ArrFieldInterface {
      return arrField;
    },
    remove(): void {
      set((state) => ({
        fields: state.arrFields.filter((item) => item.id !== arrField.id),
      }));
    },
    addItem(index?: number): void {
      const { id, fields } = arrField;
      const newItem = `${id}.${fields.length}`;
      const newItems = [...fields];
      if (typeof index === 'undefined') {
        setArrField(id, { fields: [...newItems, newItem] });
      } else {
        setArrField(id, { fields: newItems.splice(index, index, newItem) });
      }
    },
    removeItem(index: number): void {
      const { id, fields } = arrField;
      const newItems = [...fields];
      newItems.splice(index, 1);
      setArrField(id, { fields: newItems });
    },
    moveItem(fromIndex: number, toIndex: number): void {
      const { id, fields } = arrField;
      const newItems = [...fields];
      const item = newItems[fromIndex];
      newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, item);
      setArrField(id, { fields: newItems });
    },
    setItems(items: Array<string>): void {
      setArrField(arrField.id, { fields: items });
    },
    getItems(): Array<string> {
      return arrField.fields;
    },
  };
};
