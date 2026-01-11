import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const statusChipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      status: {
        approved: 'bg-status-approved-bg text-status-approved',
        pending: 'bg-status-pending-bg text-status-pending',
        expired: 'bg-status-expired-bg text-status-expired',
        draft: 'bg-status-draft-bg text-status-draft',
        fulfilled: 'bg-status-fulfilled-bg text-status-fulfilled',
        overdue: 'bg-status-expired-bg text-status-expired',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      status: 'pending',
      size: 'md',
    },
  }
);

interface StatusChipProps extends VariantProps<typeof statusChipVariants> {
  children: React.ReactNode;
  className?: string;
  showDot?: boolean;
}

export function StatusChip({ 
  status, 
  size, 
  children, 
  className,
  showDot = true,
}: StatusChipProps) {
  return (
    <span className={cn(statusChipVariants({ status, size }), className)}>
      {showDot && (
        <span 
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            status === 'approved' && 'bg-status-approved',
            status === 'pending' && 'bg-status-pending',
            status === 'expired' && 'bg-status-expired',
            status === 'draft' && 'bg-status-draft',
            status === 'fulfilled' && 'bg-status-fulfilled',
            status === 'overdue' && 'bg-status-expired',
          )}
        />
      )}
      {children}
    </span>
  );
}
