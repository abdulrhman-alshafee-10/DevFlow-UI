// Barrel exports for design-system primitives.
// Import from `@/components/ui` when consuming multiple components.

export { Badge, badgeVariants } from './badge';
export type { BadgeProps } from './badge';

export { Button, buttonVariants } from './button';
export type { ButtonProps } from './button';

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

export { Input } from './input';
export type { InputProps } from './input';

export { Label } from './label';
export type { LabelProps } from './label';

export { Spinner } from './spinner';
export type { SpinnerProps } from './spinner';

export { Avatar } from './avatar';
export type { AvatarProps, AvatarSize } from './avatar';

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from './modal';
export type { ModalContentProps } from './modal';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
export type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
} from './dropdown-menu';

export { Toaster, toast } from './toast';
export type {
  ToasterProps,
  ToastOptions,
  ToastAPI,
  ToastVariant,
} from './toast';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

export { DataTable } from './data-table';
export type { DataTableColumn, DataTableProps } from './data-table';

export { Pagination } from './pagination';
