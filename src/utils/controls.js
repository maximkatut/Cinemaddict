import {ControlKeys} from "../const.js";

export const checkControlsOnChange = (oldCard, newCard) => {
  let isCardControlsChanged = false;
  Object.keys(newCard).forEach((key) => {
    if (oldCard[key] !== newCard[key]) {
      if (Object.values(ControlKeys).includes(key)) {
        isCardControlsChanged = true;
      }
    }
  });
  return isCardControlsChanged;
};


