import { Badge } from '@/components/ui/badge';
import type { BadgeVariant, ProjectStatus } from '@/types';

const STATUS_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  active: 'success',
  completed: 'info',
  archived: 'outline',
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

/** Consistently styled badge for a project's lifecycle status. */
export function ProjectStatusBadge({
  status,
  className,
}: ProjectStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
