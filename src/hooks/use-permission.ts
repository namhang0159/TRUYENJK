import { useAuthStore } from '@/store/auth-store';

export const PERMISSIONS = {
  // Content Management
  APPROVE_STORY: 'APPROVE_STORY',
  EDIT_STORY: 'EDIT_STORY',
  DELETE_STORY: 'DELETE_STORY',
  HIDE_COMMENT: 'HIDE_COMMENT',
  BAN_USER: 'BAN_USER',
  
  // Finance Management
  VIEW_REVENUE: 'VIEW_REVENUE',
  APPROVE_PAYOUT: 'APPROVE_PAYOUT',
  MANAGE_VIP: 'MANAGE_VIP',
} as const;

export type Permission = keyof typeof PERMISSIONS;

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  CONTENT_MODERATOR: [
    PERMISSIONS.APPROVE_STORY,
    PERMISSIONS.EDIT_STORY,
    PERMISSIONS.DELETE_STORY,
    PERMISSIONS.HIDE_COMMENT,
    PERMISSIONS.BAN_USER,
  ],
  FINANCE_MANAGER: [
    PERMISSIONS.VIEW_REVENUE,
    PERMISSIONS.APPROVE_PAYOUT,
    PERMISSIONS.MANAGE_VIP,
  ],
};

export const usePermission = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role !== 'ADMIN') return false;
    
    // Fallback if adminRole is not yet fetched or set
    if (!user.adminRole) {
      // Default fallback: SUPER_ADMIN if missing just to prevent breaking UI before they re-login? 
      // Actually, safest is false. But let's assume they have it.
      return false; 
    }

    const allowedPermissions = ROLE_PERMISSIONS[user.adminRole] || [];
    return allowedPermissions.includes(permission);
  };

  return { hasPermission };
};
