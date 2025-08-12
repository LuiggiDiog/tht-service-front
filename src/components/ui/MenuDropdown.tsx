import { mdiDotsVertical } from '@mdi/js';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ReactNode } from 'react';
import BaseIcon from './BaseIcon';

export type MenuDropdownItem = {
  id: string;
  label: string;
  icon?: string;
  iconColor?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'info';
  hidden?: boolean;
  tooltip?: string;
  shortcut?: string;
  confirmationRequired?: boolean;
  target?: '_blank' | '_self';
};

export type MenuDropdownGroup = {
  id: string;
  items: MenuDropdownItem[];
  separator?: boolean;
};

type MenuDropdownProps = {
  trigger?: ReactNode;
  groups: MenuDropdownGroup[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
};

export default function MenuDropdown({
  trigger,
  groups,
  align = 'end',
  side = 'bottom',
  sideOffset = 5,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Más opciones',
}: MenuDropdownProps) {
  const defaultTrigger = (
    <button
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <BaseIcon path={mdiDotsVertical} size="18" />
    </button>
  );

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20';
      case 'success':
        return 'text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20';
      case 'warning':
        return 'text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20';
      case 'info':
        return 'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20';
      default:
        return 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700';
    }
  };

  const getVariantIconColor = (variant?: string) => {
    switch (variant) {
      case 'danger':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderItem = (item: MenuDropdownItem) => {
    if (item.hidden) return null;

    const baseClasses = `
      flex items-center gap-3 w-full px-3 py-2 text-sm rounded cursor-pointer outline-none text-left relative
      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${getVariantClasses(item.variant)}
    `;

    const content = (
      <>
        {item.icon && (
          <BaseIcon
            path={item.icon}
            size="16"
            className={item.iconColor || getVariantIconColor(item.variant)}
          />
        )}
        <span className="flex-1">{item.label}</span>
        {item.shortcut && (
          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
            {item.shortcut}
          </span>
        )}
      </>
    );

    const ItemWrapper = ({ children }: { children: React.ReactNode }) => (
      <DropdownMenu.Item key={item.id} asChild>
        {children}
      </DropdownMenu.Item>
    );

    if (item.href && !item.disabled) {
      return (
        <ItemWrapper>
          <a
            href={item.href}
            className={baseClasses}
            target={item.target}
            title={item.tooltip}
          >
            {content}
          </a>
        </ItemWrapper>
      );
    }

    return (
      <ItemWrapper>
        <button
          onClick={item.onClick}
          disabled={item.disabled}
          className={baseClasses}
          title={item.tooltip}
        >
          {content}
        </button>
      </ItemWrapper>
    );
  };

  const visibleGroups = groups.filter((group) =>
    group.items.some((item) => !item.hidden)
  );

  if (visibleGroups.length === 0) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        {trigger || defaultTrigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-white dark:bg-gray-800 rounded-md p-1 shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          align={align}
          side={side}
          sideOffset={sideOffset}
        >
          {visibleGroups.map((group, groupIndex) => (
            <div key={group.id}>
              {group.items
                .filter((item) => !item.hidden)
                .map((item) => renderItem(item))}

              {group.separator && groupIndex < visibleGroups.length - 1 && (
                <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
              )}
            </div>
          ))}

          <DropdownMenu.Arrow className="fill-white dark:fill-gray-800" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
