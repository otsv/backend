export enum RolePermission {
  manageUsers,
  manageOrders,
  placeOrder,
}

export enum Role {
  admin = 'admin',
  adminCafeteria = 'adminCafeteria',
  staff = 'staff',
}

export const RoleConfig = {
  [Role.admin]: [RolePermission.manageUsers],
  [Role.adminCafeteria]: [RolePermission.manageOrders],
  [Role.staff]: [RolePermission.placeOrder],
};
