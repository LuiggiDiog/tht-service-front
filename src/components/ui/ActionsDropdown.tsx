import { mdiDotsVertical } from '@mdi/js';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ReactNode } from 'react';
import BaseIcon from './BaseIcon';

export type ActionItem = {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  hidden?: boolean;
  disabled?: boolean;
};

export type ActionGroup = {
  items: ActionItem[];
  separator?: boolean;
};

type ActionsDropdownProps = {
  groups: ActionGroup[];
  trigger?: ReactNode;
  align?: 'start' | 'center' | 'end';
};

export default function ActionsDropdown({
  groups,
  trigger,
  align = 'end',
}: ActionsDropdownProps) {
  const defaultTrigger = (
    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
      <BaseIcon path={mdiDotsVertical} size="18" />
    </button>
  );

  const visibleGroups = groups.filter((group) =>
    group.items.some((item) => !item.hidden)
  );

  if (visibleGroups.length === 0) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-white dark:bg-gray-800 rounded-md p-1 shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          align={align}
          sideOffset={5}
        >
          {visibleGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.items
                .filter((item) => !item.hidden)
                .map((item, itemIndex) => {
                  const classes = `
                    flex items-center gap-3 w-full px-3 py-2 text-sm rounded cursor-pointer outline-none text-left
                    ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      item.variant === 'danger'
                        ? 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `;

                  const content = (
                    <>
                      {item.icon && (
                        <BaseIcon
                          path={item.icon}
                          size="16"
                          className={
                            item.variant === 'danger'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }
                        />
                      )}
                      {item.label}
                    </>
                  );

                  return (
                    <DropdownMenu.Item key={itemIndex} asChild>
                      {item.href ? (
                        <a href={item.href} className={classes}>
                          {content}
                        </a>
                      ) : (
                        <button
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={classes}
                        >
                          {content}
                        </button>
                      )}
                    </DropdownMenu.Item>
                  );
                })}

              {group.separator && groupIndex < visibleGroups.length - 1 && (
                <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-600 my-1" />
              )}
            </div>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
