export enum RolePermission {
  manageUsers,
  manageOrders,
  placeOrder,
}

export enum RoleEnum {
  admin = 'admin',
  vendor = 'vendor',
  employee = 'employee',
}

export const RoleConfig = {
  [RoleEnum.admin]: [RolePermission.manageUsers],
  [RoleEnum.vendor]: [RolePermission.manageOrders],
  [RoleEnum.employee]: [RolePermission.placeOrder],
};
