"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseRealtimeOptions {
  table: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onPayload: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
}

export function useRealtime({
  table,
  filter,
  event = "*",
  onPayload,
}: UseRealtimeOptions): void {
  const callbackRef = useRef(onPayload);
  useEffect(() => {
    callbackRef.current = onPayload;
  });

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    const channelConfig: Record<string, string> = {
      event,
      schema: "public",
      table,
    };

    if (filter) {
      channelConfig.filter = filter;
    }

    channel = supabase
      .channel(`realtime:${table}:${filter ?? "all"}`)
      .on(
        "postgres_changes" as never,
        channelConfig,
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          if (!cancelled) {
            callbackRef.current(payload);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (channel) {
        channel.unsubscribe().then(() => {
          supabase.removeChannel(channel!);
        });
      }
    };
  }, [table, filter, event]);
}
