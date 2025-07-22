import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteTicket,
  getPartChanges,
  getTicket,
  getTicketEvidences,
  getTickets,
  postPartChange,
  postTicket,
  postTicketEvidence,
  updateTicket,
} from './tickets.service';

export const KEY_QUERY_TICKETS = 'tickets';

// Principales de tickets
export function useGetTickets() {
  return useQuery({
    queryKey: [KEY_QUERY_TICKETS],
    queryFn: getTickets,
  });
}

export function useGetTicket(id: number | string | undefined) {
  const idValue = parseInt(id as string);

  return useQuery({
    queryKey: [KEY_QUERY_TICKETS, id],
    queryFn: () => getTicket(idValue),
    enabled: !!idValue,
  });
}

export function usePostTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
  });
}

export function usePutTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
  });
}

// Para evidencias
export function usePostTicketEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postTicketEvidence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
  });
}

export function useGetTicketEvidences(ticket_id: number) {
  return useQuery({
    queryKey: [KEY_QUERY_TICKETS, ticket_id, 'evidences'],
    queryFn: () => getTicketEvidences(ticket_id),
  });
}

// Para cambios de piezas
export function usePostPartChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPartChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
  });
}

export function useGetPartChanges(ticket_id: number) {
  return useQuery({
    queryKey: [KEY_QUERY_TICKETS, ticket_id, 'part-changes'],
    queryFn: () => getPartChanges(ticket_id),
  });
}
