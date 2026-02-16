"use client";

import { useState, useCallback } from "react";
import type { Proposal, ProposalStatus } from "@/types";

interface UseProposalsReturn {
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
  updateProposalLocally: (id: string, updates: Partial<Proposal>) => void;
  removeProposalLocally: (id: string) => void;
  filterByStatus: (status: ProposalStatus | null) => Proposal[];
}

export function useProposals(initialProposals: Proposal[] = []): UseProposalsReturn {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);

  const updateProposalLocally = useCallback(
    (id: string, updates: Partial<Proposal>): void => {
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const removeProposalLocally = useCallback((id: string): void => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const filterByStatus = useCallback(
    (status: ProposalStatus | null): Proposal[] => {
      if (!status) return proposals;
      return proposals.filter((p) => p.status === status);
    },
    [proposals]
  );

  return {
    proposals,
    setProposals,
    updateProposalLocally,
    removeProposalLocally,
    filterByStatus,
  };
}
