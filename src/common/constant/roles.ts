export enum RolePermission {
  manageUsers,
  manageUser,
  manageOrder,
  placeOrder,
}

export enum Role {
  admin,
  adminCafeteria,
  staff,
}

export const RoleConfig = new Map<Role, Array<RolePermission>>([
  [Role.admin, [RolePermission.manageUsers, RolePermission.manageUser]],
  [
    Role.adminCafeteria,
    [RolePermission.manageOrder, RolePermission.manageUser],
  ],
  [Role.staff, [RolePermission.manageUser, RolePermission.placeOrder]],
]);
