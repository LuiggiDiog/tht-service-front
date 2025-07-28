import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeTicketStatus,
  closeTicket,
  deleteTicket,
  deleteTicketEvidence,
  getPartChanges,
  getTicket,
  getTicketEvidences,
  getTicketPublic,
  getTickets,
  postPartChange,
  postTicket,
  postTicketEvidence,
  updateTicket,
} from './tickets.service';
import { TicketDetailT } from './tickets.type';

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
  }) as { data: TicketDetailT | undefined; isLoading: boolean; error: unknown };
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

export function useChangeTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeTicketStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
  });
}

export function useCloseTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeTicket,
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

export function useDeleteTicketEvidence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicketEvidence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_TICKETS] });
    },
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

// Para tickets públicos
export function useGetTicketPublic(public_id: string | undefined) {
  const publicIdValue = String(public_id);
  return useQuery({
    queryKey: [KEY_QUERY_TICKETS, 'public', public_id],
    queryFn: () => getTicketPublic(publicIdValue),
    enabled: !!public_id,
  });
}
