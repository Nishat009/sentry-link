export type EvidenceStatus = 'approved' | 'pending' | 'expired' | 'draft';
export type RequestStatus = 'pending' | 'fulfilled' | 'overdue';

export interface EvidenceVersion {
  id: string;
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  notes: string;
  fileSize: string;
  fileName: string;
}

export interface Evidence {
  id: string;
  name: string;
  docType: string;
  status: EvidenceStatus;
  expiryDate: string | null;
  versions: EvidenceVersion[];
  lastUpdated: string;
  description?: string;
}

export interface BuyerRequestItem {
  id: string;
  docType: string;
  dueDate: string;
  status: RequestStatus;
  buyerName: string;
  notes?: string;
  fulfilledWith?: string;
}

export const docTypes = [
  'ISO 27001 Certificate',
  'SOC 2 Type II Report',
  'GDPR Compliance Statement',
  'Business Continuity Plan',
  'Penetration Test Report',
  'Data Processing Agreement',
  'Insurance Certificate',
  'Financial Audit Report',
];

export const mockEvidence: Evidence[] = [
  {
    id: 'ev-001',
    name: 'ISO 27001:2022 Certificate',
    docType: 'ISO 27001 Certificate',
    status: 'approved',
    expiryDate: '2025-12-15',
    lastUpdated: '2024-01-10',
    description: 'Information security management system certification issued by BSI Group.',
    versions: [
      {
        id: 'v-001-3',
        version: 3,
        uploadedAt: '2024-01-10',
        uploadedBy: 'Sarah Chen',
        notes: 'Updated certificate with 2022 standard compliance',
        fileSize: '2.4 MB',
        fileName: 'ISO27001_Certificate_2024.pdf',
      },
      {
        id: 'v-001-2',
        version: 2,
        uploadedAt: '2023-01-15',
        uploadedBy: 'Michael Park',
        notes: 'Annual renewal certificate',
        fileSize: '2.1 MB',
        fileName: 'ISO27001_Certificate_2023.pdf',
      },
      {
        id: 'v-001-1',
        version: 1,
        uploadedAt: '2022-01-20',
        uploadedBy: 'Sarah Chen',
        notes: 'Initial certification',
        fileSize: '1.9 MB',
        fileName: 'ISO27001_Certificate_2022.pdf',
      },
    ],
  },
  {
    id: 'ev-002',
    name: 'SOC 2 Type II Report 2024',
    docType: 'SOC 2 Type II Report',
    status: 'approved',
    expiryDate: '2025-06-30',
    lastUpdated: '2024-07-01',
    description: 'Service Organization Control report covering security, availability, and confidentiality.',
    versions: [
      {
        id: 'v-002-2',
        version: 2,
        uploadedAt: '2024-07-01',
        uploadedBy: 'James Wilson',
        notes: 'Latest audit report with zero exceptions',
        fileSize: '15.8 MB',
        fileName: 'SOC2_TypeII_2024.pdf',
      },
      {
        id: 'v-002-1',
        version: 1,
        uploadedAt: '2023-07-15',
        uploadedBy: 'James Wilson',
        notes: 'Previous year audit report',
        fileSize: '14.2 MB',
        fileName: 'SOC2_TypeII_2023.pdf',
      },
    ],
  },
  {
    id: 'ev-003',
    name: 'GDPR Data Processing Agreement',
    docType: 'Data Processing Agreement',
    status: 'pending',
    expiryDate: null,
    lastUpdated: '2024-11-20',
    description: 'Standard contractual clauses for GDPR compliance with data processors.',
    versions: [
      {
        id: 'v-003-1',
        version: 1,
        uploadedAt: '2024-11-20',
        uploadedBy: 'Emily Rodriguez',
        notes: 'Submitted for legal review',
        fileSize: '856 KB',
        fileName: 'DPA_Template_v1.pdf',
      },
    ],
  },
  {
    id: 'ev-004',
    name: 'Annual Penetration Test Report',
    docType: 'Penetration Test Report',
    status: 'expired',
    expiryDate: '2024-03-01',
    lastUpdated: '2023-03-15',
    description: 'Third-party security assessment and vulnerability testing results.',
    versions: [
      {
        id: 'v-004-1',
        version: 1,
        uploadedAt: '2023-03-15',
        uploadedBy: 'Alex Thompson',
        notes: 'Q1 2023 penetration test by SecureAudit Inc.',
        fileSize: '4.2 MB',
        fileName: 'PenTest_Report_Q1_2023.pdf',
      },
    ],
  },
  {
    id: 'ev-005',
    name: 'Business Continuity Plan 2024',
    docType: 'Business Continuity Plan',
    status: 'approved',
    expiryDate: '2025-01-31',
    lastUpdated: '2024-02-01',
    description: 'Comprehensive disaster recovery and business continuity procedures.',
    versions: [
      {
        id: 'v-005-2',
        version: 2,
        uploadedAt: '2024-02-01',
        uploadedBy: 'Sarah Chen',
        notes: 'Updated with new DR site information',
        fileSize: '3.7 MB',
        fileName: 'BCP_2024_v2.pdf',
      },
      {
        id: 'v-005-1',
        version: 1,
        uploadedAt: '2023-02-10',
        uploadedBy: 'Michael Park',
        notes: 'Initial BCP document',
        fileSize: '3.2 MB',
        fileName: 'BCP_2023.pdf',
      },
    ],
  },
  {
    id: 'ev-006',
    name: 'Cyber Liability Insurance',
    docType: 'Insurance Certificate',
    status: 'approved',
    expiryDate: '2025-08-15',
    lastUpdated: '2024-08-20',
    description: '$5M cyber liability coverage from Marsh Insurance.',
    versions: [
      {
        id: 'v-006-1',
        version: 1,
        uploadedAt: '2024-08-20',
        uploadedBy: 'Finance Team',
        notes: 'Renewed policy with increased coverage',
        fileSize: '1.2 MB',
        fileName: 'CyberInsurance_2024.pdf',
      },
    ],
  },
  {
    id: 'ev-007',
    name: 'GDPR Compliance Statement',
    docType: 'GDPR Compliance Statement',
    status: 'draft',
    expiryDate: null,
    lastUpdated: '2024-12-01',
    description: 'Self-attestation document for GDPR compliance.',
    versions: [
      {
        id: 'v-007-1',
        version: 1,
        uploadedAt: '2024-12-01',
        uploadedBy: 'Emily Rodriguez',
        notes: 'Draft - pending internal review',
        fileSize: '524 KB',
        fileName: 'GDPR_Statement_Draft.pdf',
      },
    ],
  },
  {
    id: 'ev-008',
    name: 'Q3 2024 Financial Audit',
    docType: 'Financial Audit Report',
    status: 'approved',
    expiryDate: '2025-09-30',
    lastUpdated: '2024-10-15',
    description: 'Quarterly financial audit conducted by Deloitte.',
    versions: [
      {
        id: 'v-008-1',
        version: 1,
        uploadedAt: '2024-10-15',
        uploadedBy: 'Finance Team',
        notes: 'Clean audit opinion',
        fileSize: '8.9 MB',
        fileName: 'FinancialAudit_Q3_2024.pdf',
      },
    ],
  },
];

export const mockBuyerRequests: BuyerRequestItem[] = [
  {
    id: 'req-001',
    docType: 'SOC 2 Type II Report',
    dueDate: '2025-01-15',
    status: 'pending',
    buyerName: 'Acme Corporation',
    notes: 'Required for vendor onboarding process',
  },
  {
    id: 'req-002',
    docType: 'ISO 27001 Certificate',
    dueDate: '2025-01-10',
    status: 'fulfilled',
    buyerName: 'Acme Corporation',
    fulfilledWith: 'ev-001',
  },
  {
    id: 'req-003',
    docType: 'Penetration Test Report',
    dueDate: '2024-12-20',
    status: 'overdue',
    buyerName: 'TechStart Inc.',
    notes: 'Annual security assessment requirement',
  },
  {
    id: 'req-004',
    docType: 'Business Continuity Plan',
    dueDate: '2025-02-01',
    status: 'pending',
    buyerName: 'Global Finance Ltd.',
  },
  {
    id: 'req-005',
    docType: 'Insurance Certificate',
    dueDate: '2025-01-25',
    status: 'pending',
    buyerName: 'TechStart Inc.',
    notes: 'Minimum $3M coverage required',
  },
  {
    id: 'req-006',
    docType: 'Data Processing Agreement',
    dueDate: '2025-01-30',
    status: 'pending',
    buyerName: 'HealthCare Plus',
    notes: 'HIPAA-compliant DPA required',
  },
];
