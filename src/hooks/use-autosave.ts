"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { AUTOSAVE_DELAY_MS } from "@/lib/constants";

interface UseAutosaveOptions {
  onSave: (data: Record<string, unknown>) => Promise<void>;
  delay?: number;
}

interface UseAutosaveReturn {
  triggerSave: (data: Record<string, unknown>) => void;
  flush: () => Promise<void>;
  saving: boolean;
  lastSaved: Date | null;
}

export function useAutosave({ onSave, delay = AUTOSAVE_DELAY_MS }: UseAutosaveOptions): UseAutosaveReturn {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<Record<string, unknown> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const flush = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (pendingDataRef.current) {
      const data = pendingDataRef.current;
      pendingDataRef.current = null;
      try {
        await onSaveRef.current(data);
      } catch {
        // Best-effort flush on unmount
      }
    }
  }, []);

  const triggerSave = useCallback(
    (data: Record<string, unknown>) => {
      pendingDataRef.current = data;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        if (pendingDataRef.current) {
          setSaving(true);
          try {
            await onSaveRef.current(pendingDataRef.current);
            setLastSaved(new Date());
          } catch (error) {
            console.error("Autosave failed:", error);
          } finally {
            setSaving(false);
            pendingDataRef.current = null;
          }
        }
      }, delay);
    },
    [delay]
  );

  // Flush pending saves on unmount
  useEffect(() => {
    return () => {
      flush();
    };
  }, [flush]);

  return { triggerSave, flush, saving, lastSaved };
}
