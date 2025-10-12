export const USER_ROLES = {
  OPERATOR: "operator",
  ADMIN: "admin",
  VISITOR: "visitor",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Role hierarchy - higher number = more permissions
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  // Only users with this role can access any results page ( if results are visitors allowed )
  [USER_ROLES.VISITOR]: 0,
  // Users with this role can access any results page, create projects, edit all projects, delete all projects, see all results
  [USER_ROLES.OPERATOR]: 1,
  // Users with this role can also create projects, edit all projects, delete all projects, see all results, create users, edit all users, delete all users, ban users etc
  [USER_ROLES.ADMIN]: 2,
} as const;
