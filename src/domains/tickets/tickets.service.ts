import { TicketEvidenceT, TicketPartChangeT, TicketT } from './tickets.type';
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
  return resp as TicketT;
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

export const deleteTicket = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
    method: 'DELETE',
  });
  return resp as TicketT;
};

// Rutas para evidencias
export const postTicketEvidence = async (data: TicketEvidenceT) => {
  const resp = await apiFetch({
    url: `${baseURL}/evidences`,
    method: 'POST',
    body: data,
  });
  return resp as TicketEvidenceT;
};

export const getTicketEvidences = async (ticket_id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${ticket_id}/evidences`,
  });
  return resp as TicketEvidenceT[];
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
