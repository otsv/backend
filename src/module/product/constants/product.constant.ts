export const drinkPath = 'src/public/drink';

export const maxImagesUploadCount = 5;

export enum ProductStatus {
  inStock = 'inStock',
  outOfStock = 'outOfStock',
}

export enum OrderItemStatus {
  new = 'new',
  processing = 'processing',
  ready = 'ready',
  pickedUp = 'pickedUp',
  cancelled = 'cancelled',
}
