export enum RolePermission {
  manageUsers,
  manageOrders,
  placeOrder,
}

export enum Role {
  Admin = 'admin',
  VendorStaff = 'vendor staff',
  Employee = 'employee',
}

export const RoleConfig = {
  [Role.Admin]: [RolePermission.manageUsers],
  [Role.VendorStaff]: [RolePermission.manageOrders],
  [Role.Employee]: [RolePermission.placeOrder],
};
