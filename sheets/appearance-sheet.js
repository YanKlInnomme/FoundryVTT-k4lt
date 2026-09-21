import Base from './base-item-sheet.js';
export default class AppearanceSheet extends Base {
  static PARTS = {
    header:{template:'systems/k4lt/templates/items/item-header.hbs'},
    body:{template:'systems/k4lt/templates/items/appearance-sheet.hbs'},
  };
}
