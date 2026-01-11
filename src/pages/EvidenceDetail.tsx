import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Upload,
  Download,
  FileText,
  Clock,
  User,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { StatusChip } from '@/components/StatusChip';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { mockEvidence, type EvidenceVersion } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export default function EvidenceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadExpiry, setUploadExpiry] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const evidence = mockEvidence.find((e) => e.id === id);
  const [versions, setVersions] = useState<EvidenceVersion[]>(evidence?.versions || []);

  // Initialize versions from evidence data when evidence changes
  useEffect(() => {
    if (evidence) {
      setVersions(evidence.versions);
    }
  }, [evidence]);

  if (!evidence) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Document not found</h2>
            <p className="mt-1 text-muted-foreground">
              The document you're looking for doesn't exist.
            </p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Back to Vault
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleUploadSubmit = () => {
    if (!uploadNotes.trim()) {
      toast({
        title: 'Notes required',
        description: 'Please add notes describing this version.',
        variant: 'destructive',
      });
      return;
    }

    const newVersion: EvidenceVersion = {
      id: `v-${evidence.id}-${versions.length + 1}`,
      version: versions.length + 1,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      notes: uploadNotes,
      fileSize: uploadFile ? `${(uploadFile.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
      fileName: uploadFile?.name || 'document.pdf',
    };

    setVersions([newVersion, ...versions]);
    setIsUploadModalOpen(false);
    setUploadNotes('');
    setUploadExpiry('');
    setUploadFile(null);

    toast({
      title: 'Version uploaded',
      description: `Version ${newVersion.version} has been added successfully.`,
    });
  };

  return (
    <AppLayout>
      <div className="p-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vault
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{evidence.name}</h1>
              <p className="mt-1 text-muted-foreground">{evidence.docType}</p>
            </div>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload New Version
          </Button>
        </div>

        {/* Metadata */}
        <div className="mt-8 grid grid-cols-2 gap-6 rounded-xl border bg-card p-6 md:grid-cols-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status
            </div>
            <div className="mt-2">
              <StatusChip status={evidence.status} size="lg">
                {evidence.status.charAt(0).toUpperCase() + evidence.status.slice(1)}
              </StatusChip>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Expiry Date
            </div>
            <div className="mt-2 flex items-center gap-2 text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {evidence.expiryDate
                ? format(new Date(evidence.expiryDate), 'MMM d, yyyy')
                : 'No expiry'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Last Updated
            </div>
            <div className="mt-2 flex items-center gap-2 text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {format(new Date(evidence.lastUpdated), 'MMM d, yyyy')}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Versions
            </div>
            <div className="mt-2 text-foreground font-medium">
              {versions.length} version{versions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Description */}
        {evidence.description && (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-foreground">Description</h2>
            <p className="mt-2 text-muted-foreground">{evidence.description}</p>
          </div>
        )}

        {/* Version History */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Version History</h2>
          <div className="mt-4 space-y-3">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-semibold">
                      v{version.version}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.fileName}</span>
                        {index === 0 && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{version.notes}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(version.uploadedAt), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {version.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HardDrive className="h-3.5 w-3.5" />
                          {version.fileSize}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        title="Upload New Version"
        description="Add a new version of this document to the evidence vault."
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadSubmit}>Upload Version</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">
              Version Notes <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Describe what changed in this version..."
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date (optional)</Label>
            <Input
              id="expiry"
              type="date"
              value={uploadExpiry}
              onChange={(e) => setUploadExpiry(e.target.value)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Document File</Label>
            <div className="relative flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {uploadFile ? uploadFile.name : 'Click or drag to upload a file'}
                </p>
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
