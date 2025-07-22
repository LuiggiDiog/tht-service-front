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

// Nuevo tipo para ticket con información completa
export type TicketDetailT = {
  id: string;
  customer_id: string;
  technician_id: string;
  status: 'open' | 'in_progress' | 'closed';
  description: string;
  created_at: string;
  updated_at: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  technician: {
    name: string;
    email: string;
  };
  evidences: TicketEvidenceDetailT[];
  part_changes: TicketPartChangeT[];
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

// Nuevo tipo para evidencia con información completa
export type TicketEvidenceDetailT = {
  id: string;
  ticket_id: string;
  type: 'reception' | 'part_removed' | 'part_installed' | 'delivery';
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  media: {
    id: string;
    evidence_id: string;
    media_type: string;
    storage_id: string;
    url: string;
    created_at: string;
    updated_at: string;
  }[];
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
