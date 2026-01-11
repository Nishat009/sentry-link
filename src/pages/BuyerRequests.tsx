import { useState, useMemo } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { ClipboardList, Calendar, Building2, Check, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { DataTable, Column } from '@/components/DataTable';
import { StatusChip } from '@/components/StatusChip';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  mockBuyerRequests,
  mockEvidence,
  type BuyerRequestItem,
} from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export default function BuyerRequests() {
  const [requests, setRequests] = useState(mockBuyerRequests);
  const [fulfillModalOpen, setFulfillModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequestItem | null>(null);
  const [fulfillMethod, setFulfillMethod] = useState<'existing' | 'new'>('existing');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocNotes, setNewDocNotes] = useState('');

  // Get matching evidence for selected request
  const matchingEvidence = useMemo(() => {
    if (!selectedRequest) return [];
    return mockEvidence.filter(
      (e) => e.docType === selectedRequest.docType && e.status === 'approved'
    );
  }, [selectedRequest]);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const overdueCount = requests.filter((r) => r.status === 'overdue').length;

  const handleFulfillClick = (request: BuyerRequestItem) => {
    setSelectedRequest(request);
    setFulfillMethod('existing');
    setSelectedEvidenceId('');
    setNewDocName('');
    setNewDocNotes('');
    setFulfillModalOpen(true);
  };

  const handleFulfillSubmit = () => {
    if (!selectedRequest) return;

    if (fulfillMethod === 'existing' && !selectedEvidenceId) {
      toast({
        title: 'Selection required',
        description: 'Please select an existing document from the vault.',
        variant: 'destructive',
      });
      return;
    }

    if (fulfillMethod === 'new' && !newDocName.trim()) {
      toast({
        title: 'Document name required',
        description: 'Please enter a name for the new document.',
        variant: 'destructive',
      });
      return;
    }

    // Update request status
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              status: 'fulfilled' as const,
              fulfilledWith: fulfillMethod === 'existing' ? selectedEvidenceId : 'new-doc',
            }
          : r
      )
    );

    setFulfillModalOpen(false);
    toast({
      title: 'Request fulfilled',
      description: `Successfully fulfilled request for ${selectedRequest.docType}.`,
    });
  };

  const columns: Column<BuyerRequestItem>[] = [
    {
      key: 'docType',
      header: 'Requested Document',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-medium text-foreground">{item.docType}</span>
            {item.notes && (
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                {item.notes}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'buyerName',
      header: 'Buyer',
      render: (item) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          {item.buyerName}
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (item) => {
        const isOverdue = isPast(parseISO(item.dueDate)) && item.status !== 'fulfilled';
        return (
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${isOverdue ? 'text-status-expired' : 'text-muted-foreground'}`} />
            <span className={isOverdue ? 'text-status-expired font-medium' : 'text-muted-foreground'}>
              {format(parseISO(item.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const statusLabels = {
          pending: 'Pending',
          fulfilled: 'Fulfilled',
          overdue: 'Overdue',
        };
        return (
          <StatusChip status={item.status}>
            {statusLabels[item.status]}
          </StatusChip>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (item) =>
        item.status !== 'fulfilled' && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleFulfillClick(item);
            }}
            className="gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Fulfill
          </Button>
        ),
    },
  ];

  return (
    <AppLayout>
      <div className="p-8">
        <PageHeader
          title="Buyer Requests"
          description="Fulfill document requests from your buyers"
        />

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="text-2xl font-semibold">{requests.length}</div>
            <div className="text-sm text-muted-foreground">Total Requests</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="text-2xl font-semibold text-status-pending">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="text-2xl font-semibold text-status-expired">{overdueCount}</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="text-2xl font-semibold text-status-fulfilled">
              {requests.filter((r) => r.status === 'fulfilled').length}
            </div>
            <div className="text-sm text-muted-foreground">Fulfilled</div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          <DataTable
            data={requests}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyMessage="No buyer requests yet"
          />
        </div>
      </div>

      {/* Fulfill Modal */}
      <Modal
        open={fulfillModalOpen}
        onOpenChange={setFulfillModalOpen}
        title="Fulfill Request"
        description={selectedRequest ? `Provide ${selectedRequest.docType} for ${selectedRequest.buyerName}` : ''}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setFulfillModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFulfillSubmit}>
              <Check className="mr-2 h-4 w-4" />
              Mark as Fulfilled
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <RadioGroup
            value={fulfillMethod}
            onValueChange={(v) => setFulfillMethod(v as 'existing' | 'new')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing" className="font-medium">
                Use existing evidence from vault
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="font-medium">
                Create new evidence
              </Label>
            </div>
          </RadioGroup>

          <Separator />

          {fulfillMethod === 'existing' ? (
            <div className="space-y-3">
              {matchingEvidence.length === 0 ? (
                <div className="flex items-center gap-3 rounded-lg border border-status-pending-bg bg-status-pending-bg/50 p-4">
                  <AlertCircle className="h-5 w-5 text-status-pending" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">No matching documents</p>
                    <p className="text-muted-foreground">
                      No approved {selectedRequest?.docType} found in your vault. Create a new one instead.
                    </p>
                  </div>
                </div>
              ) : (
                <RadioGroup
                  value={selectedEvidenceId}
                  onValueChange={setSelectedEvidenceId}
                  className="space-y-2"
                >
                  {matchingEvidence.map((evidence) => (
                    <label
                      key={evidence.id}
                      htmlFor={evidence.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                        selectedEvidenceId === evidence.id ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      <RadioGroupItem value={evidence.id} id={evidence.id} />
                      <div className="flex-1">
                        <p className="font-medium">{evidence.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last updated {format(parseISO(evidence.lastUpdated), 'MMM d, yyyy')} •{' '}
                          v{evidence.versions.length}
                        </p>
                      </div>
                      <StatusChip status={evidence.status} size="sm">
                        {evidence.status}
                      </StatusChip>
                    </label>
                  ))}
                </RadioGroup>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="docName">
                  Document Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="docName"
                  placeholder="Enter document name..."
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="docNotes">Notes (optional)</Label>
                <Textarea
                  id="docNotes"
                  placeholder="Add any relevant notes..."
                  value={newDocNotes}
                  onChange={(e) => setNewDocNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Note: In a real implementation, this would create a new evidence document in your vault.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
}
