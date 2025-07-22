import { mdiAccountMultiple, mdiTicket } from '@mdi/js';

export type ColorButtonKey =
  | 'white'
  | 'whiteDark'
  | 'lightDark'
  | 'contrast'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'void';

export type Columns = {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
};

export type MenuAsideItem = {
  label: string;
  icon?: string;
  href?: string;
  target?: string;
  color?: ColorButtonKey;
  isLogout?: boolean;
  menu?: MenuAsideItem[];
  isToggleLightDark?: boolean;
  data?: object[] | undefined;
  columns?: Columns;
  permission?: string;
};

const menuAside: MenuAsideItem[] = [
  {
    label: 'Usuarios',
    icon: mdiAccountMultiple,
    href: '/users',
  },
  {
    label: 'Clientes',
    icon: mdiAccountMultiple,
    href: '/customers',
  },
  {
    label: 'Tickets',
    icon: mdiTicket,
    href: '/tickets',
  },
  /* {
    label: 'Tiendas',
    icon: mdiFileChart,
    href: '/stores',
  },
  {
    label: 'Productos',
    icon: mdiMessageTextFast,
    href: '/products',
  }, */
  /* {
    label: 'Bodegas',
    icon: mdiMessageTextFast,
    href: '/warehouses',
  },
  {
    label: 'Lotes',
    icon: mdiFileChart,
    href: '/lots',
  },
  {
    label: 'Lotes finalizados',
    icon: mdiFileChart,
    href: '/lots?status=finalized',
  },
  {
    label: 'Reportes',
    icon: mdiFileChart,
    menu: [
      {
        label: 'Lotes por producto',
        href: '/lots/report-by-product',
      },
      {
        label: 'Rastreo de lotes',
        href: '/lots/report',
      },
    ],
  }, */
  /* {
    label: 'Lotes Inactivos',
    icon: mdiInformation,
    href: '/lots/inactive',
  }, */
];

export default menuAside;
