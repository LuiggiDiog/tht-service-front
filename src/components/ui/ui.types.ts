type Columns = {
  [key: string]: string;
};

export type UserPayloadObject = {
  name: string;
  email: string;
  avatar: string;
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

export type MenuNavBarItem = {
  label?: string;
  icon?: string;
  href?: string;
  target?: string;
  isDivider?: boolean;
  isLogout?: boolean;
  isDesktopNoLabel?: boolean;
  isToggleLightDark?: boolean;
  isCurrentUser?: boolean;
  menu?: MenuNavBarItem[];
  isExternal?: boolean;
  isListRoles?: boolean;
  isRole?: boolean;
};

export type ColorKey =
  | 'white'
  | 'light'
  | 'contrast'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

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

export type BgKey = 'purplePink' | 'pinkRed';

export type TrendType =
  | 'up'
  | 'down'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export type TransactionType = 'withdraw' | 'deposit' | 'invoice' | 'payment';

export type Transaction = {
  id: number;
  amount: number;
  account: string;
  name: string;
  date: string;
  type: TransactionType;
  business: string;
};

export type Client = {
  id: number;
  avatar: string;
  login: string;
  name: string;
  company: string;
  city: string;
  progress: number;
  created: string;
  created_mm_dd_yyyy: string;
};

export type StyleKey = 'white' | 'basic';

export type UserForm = {
  name: string;
  email: string;
};
