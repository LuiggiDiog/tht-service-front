import { useAuthStore } from '../auth';
import { MenuAsideItem } from '@/components/ui/ui.types';

const permissions = [
  {
    id: 'super_admin',
    routes: [],
    accessFull: true,
  },
  {
    id: 'admin',
    routes: [],
    accessFull: true,
  },
  {
    id: 'support',
    routes: ['customers*', 'tickets*'],
    excludeRoutes: [],
    accessFull: false,
  },
  {
    id: 'vendor',
    routes: ['customers*', 'tickets*'],
    excludeRoutes: [
      'customers/edit',
      'tickets/evidence',
      'tickets/change-status',
    ],
    accessFull: false,
  },
];

type ValidatePermissionT = {
  id: string | number;
  item: MenuAsideItem;
};

export function validatePermissionItem(props: ValidatePermissionT) {
  const { id, item } = props;

  const { menu, href: route } = item;

  if (menu) {
    const hasPermission = menu.some((m) =>
      validatePermissionItem({ id, item: m })
    );
    return hasPermission;
  }

  if (!id || !route) return false;
  const permission = permissions.find((p) => p.id.toString() === id.toString());
  if (!permission) return false;
  if (permission.accessFull) return true;

  const routeClean = route.startsWith('/') ? route.slice(1) : route;

  if (
    permission.excludeRoutes &&
    permission.excludeRoutes.includes(routeClean)
  ) {
    return false;
  }

  const partialPermission = permission.routes.some((r) => {
    if (r.includes('*')) {
      const routeMatch = r.replace('*', '');
      return routeClean.startsWith(routeMatch);
    } else if (r === routeClean) {
      return true;
    }
    return false;
  });

  return partialPermission;
}

type ValidatePermissionRouteT = {
  id: string | number;
  route: string;
};

export function validatePermission(props: ValidatePermissionRouteT) {
  const { id, route } = props;

  if (!id || !route) return false;
  const permission = permissions.find((p) => p.id.toString() === id.toString());
  if (!permission) return false;
  if (permission.accessFull) return true;

  const routeClean = route.startsWith('/') ? route.slice(1) : route;

  if (
    permission.excludeRoutes &&
    permission.excludeRoutes.includes(routeClean)
  ) {
    return false;
  }

  const partialPermission = permission.routes.some((r) => {
    if (r.includes('*')) {
      const routeMatch = r.replace('*', '');
      return routeClean.startsWith(routeMatch);
    } else if (r === routeClean) {
      return true;
    }
    return false;
  });

  return partialPermission;
}

export const useValidatePermissionCurrentRole = (permission: string) => {
  const role = useAuthStore((state) => state.user?.role || '');
  if (!role) return false;
  return validatePermission({ id: role, route: permission });
};
