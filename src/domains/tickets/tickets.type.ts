export type TicketT = {
  id: number;
  customer_id: number;
  technician_id: number;
  status: 'open' | 'in_progress' | 'closed';
  description: string;
  created_at: string;
  updated_at: string;

  evidence_comment: string;
  evidence_type: 'reception' | 'part_removed' | 'part_installed' | 'delivery';
};

export type TicketEvidenceT = {
  id: number;
  ticket_id: number;
  type: 'reception' | 'part_removed' | 'part_installed' | 'delivery';
  user_id: number;
  comment: string;
  created_at: string;
  updated_at: string;

  files: File[];
};

export type TicketPartChangeT = {
  id: number;
  ticket_id: number;
  removed_part_name: string;
  installed_part_name: string;
  removed_evidence_id: number;
  installed_evidence_id: number;
  created_at: string;
  updated_at: string;
};
