import { CustomerT } from '../customers';
import { UserT } from '../users';

export type TicketT = {
  id: number;
  customer_id: number;
  technician_id: number;

  device_model: string;
  device_serial: string;

  description: string;
  amount: number;

  payment_method: string;
  payment_first_amount: number;
  payment_second_amount?: number;

  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

// Nuevo tipo para ticket con información completa
export type TicketDetailT = {
  id: string;
  customer_id: string;
  technician_id: string;
  device_model: string;
  device_serial: string;
  description: string;
  amount: string;
  payment_method: string;
  payment_first_amount: string;
  payment_second_amount: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  customer: CustomerT;
  technician: UserT;
  evidences: TicketEvidenceT[];
  part_changes: TicketPartChangeT[];
};

export type TicketEvidenceT = {
  id: number;
  ticket_id: number;

  type: string;
  comment: string;

  status: string;
  created_by: string;
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

// Nuevo tipo para media de evidencia
export type TicketEvidenceMediaT = {
  id: number;
  evidence_id: number;

  media_type: string;
  storage_id: string;
  url: string;

  created_at: string;
  updated_at: string;
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
