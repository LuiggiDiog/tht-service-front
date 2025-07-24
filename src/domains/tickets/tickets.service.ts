import {
  TicketDetailT,
  TicketEvidenceT,
  TicketPartChangeT,
  TicketT,
} from './tickets.type';
import apiFetch from '@/services';

const baseURL = `/tickets`;

// Rutas principales de tickets
export const getTickets = async () => {
  const resp = await apiFetch({
    url: baseURL,
  });
  return resp as TicketT[];
};

export const getTicket = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
  });
  return resp as TicketDetailT;
};

export const postTicket = async (data: TicketT) => {
  const resp = await apiFetch({
    url: baseURL,
    method: 'POST',
    body: data,
  });
  return resp as TicketT;
};

export const updateTicket = async (data: TicketT) => {
  const resp = await apiFetch({
    url: `${baseURL}/${data.id}`,
    method: 'PUT',
    body: data,
  });
  return resp as TicketT;
};

export const changeTicketStatus = async (data: TicketT) => {
  const resp = await apiFetch({
    url: `${baseURL}/${data.id}/status`,
    method: 'PUT',
    body: {
      status: data.status,
    },
  });
  return resp as TicketT;
};

export const deleteTicket = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
    method: 'DELETE',
  });
  return resp as TicketT;
};

// Rutas para evidencias
export const postTicketEvidence = async (data: TicketEvidenceT) => {
  const formData = new FormData();

  // Agregar campos básicos que irán a req.body
  formData.append('ticket_id', data.ticket_id.toString());
  formData.append('type', data.type);
  formData.append('comment', data.comment);

  // Agregar archivos que irán a req.files
  if (data.files && data.files.length > 0) {
    for (const file of data.files) {
      formData.append('files', file);
    }
  }

  const resp = await apiFetch({
    url: `${baseURL}/evidences`,
    method: 'POST',
    body: formData,
  });
  return resp as TicketEvidenceT;
};

export const getTicketEvidences = async (ticket_id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${ticket_id}/evidences`,
  });
  return resp as TicketEvidenceT[];
};

export const deleteTicketEvidence = async (evidence_id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/evidences/${evidence_id}`,
    method: 'DELETE',
  });
  return resp as TicketEvidenceT;
};

// Rutas para cambios de piezas
export const postPartChange = async (data: TicketPartChangeT) => {
  const resp = await apiFetch({
    url: `${baseURL}/part-changes`,
    method: 'POST',
    body: data,
  });
  return resp as TicketPartChangeT;
};

export const getPartChanges = async (ticket_id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${ticket_id}/part-changes`,
  });
  return resp as TicketPartChangeT[];
};
