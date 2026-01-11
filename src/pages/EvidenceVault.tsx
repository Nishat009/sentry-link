import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Search, Filter, Package, FileText, X, Eye } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusChip } from '@/components/StatusChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEvidence, docTypes, type Evidence } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

type ExpiryFilter = 'all' | 'expired' | 'expiring-soon';

export default function EvidenceVault() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filters from URL
  const searchQuery = searchParams.get('search') || '';
  const docTypeFilter = searchParams.get('docType') || 'all';
  const statusFilter = searchParams.get('status') || 'all';
  const expiryFilter = (searchParams.get('expiry') || 'all') as ExpiryFilter;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Update URL params
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = searchQuery || docTypeFilter !== 'all' || statusFilter !== 'all' || expiryFilter !== 'all';

  // Filter data
  const filteredData = useMemo(() => {
    return mockEvidence.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !item.name.toLowerCase().includes(query) &&
          !item.docType.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Doc type filter
      if (docTypeFilter !== 'all' && item.docType !== docTypeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // Expiry filter
      if (expiryFilter !== 'all' && item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const thirtyDaysFromNow = addDays(today, 30);

        if (expiryFilter === 'expired' && !isBefore(expiryDate, today)) {
          return false;
        }
        if (expiryFilter === 'expiring-soon') {
          if (isBefore(expiryDate, today) || isAfter(expiryDate, thirtyDaysFromNow)) {
            return false;
          }
        }
      } else if (expiryFilter === 'expired' || expiryFilter === 'expiring-soon') {
        return false;
      }

      return true;
    });
  }, [searchQuery, docTypeFilter, statusFilter, expiryFilter]);

  const columns: Column<Evidence>[] = [
    {
      key: 'name',
      header: 'Document Name',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'docType',
      header: 'Type',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.docType}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <StatusChip status={item.status}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </StatusChip>
      ),
    },
    {
      key: 'expiryDate',
      header: 'Expiry',
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.expiryDate ? format(new Date(item.expiryDate), 'MMM d, yyyy') : '—'}
        </span>
      ),
    },
    {
      key: 'versions',
      header: 'Versions',
      render: (item) => (
        <span className="text-sm text-muted-foreground">v{item.versions.length}</span>
      ),
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(item.lastUpdated), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/evidence/${item.id}`);
          }}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  const handleAddToPack = () => {
    toast({
      title: 'Added to pack',
      description: `${selectedIds.size} document${selectedIds.size > 1 ? 's' : ''} selected for pack`,
    });
  };

  return (
    <AppLayout>
      <div className="p-8">
        <PageHeader
          title="Evidence Vault"
          description="Manage and organize your compliance evidence documents"
          actions={
            selectedIds.size > 0 && (
              <Button onClick={handleAddToPack} className="gap-2">
                <Package className="h-4 w-4" />
                Add to Pack ({selectedIds.size})
              </Button>
            )
          }
        />

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={docTypeFilter} onValueChange={(v) => updateFilter('docType', v)}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {docTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => updateFilter('status', v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={expiryFilter} onValueChange={(v) => updateFilter('expiry', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expiry</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-muted-foreground">
          {filteredData.length} document{filteredData.length !== 1 ? 's' : ''}
        </div>

        {/* Table */}
        <div className="mt-4">
          <DataTable
            data={filteredData}
            columns={columns}
            keyExtractor={(item) => item.id}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onRowClick={(item) => navigate(`/evidence/${item.id}`)}
            emptyMessage="No documents match your filters"
          />
        </div>
      </div>
    </AppLayout>
  );
}
