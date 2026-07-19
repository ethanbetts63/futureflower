import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Order, PartialOrder } from '@/types/Order';
import { errorMessage } from '@/lib/errors';

export interface UsePlanEditorConfig<T> {
  mode: 'create' | 'edit';
  /** Form state before the order loads. */
  initialData: T;
  /** Seed the form from the loaded order. */
  fromPlan: (plan: Order) => T;
  /** Turn the form state into the fields to save. */
  toPayload: (data: T) => PartialOrder;
  /** Return an error string to block the save, or null to proceed. */
  validate?: (data: T) => string | null;
  // Bound by the caller: the guest flow resolves the order from its checkout
  // cookie, the dashboard from the planId in its own URL. getPlan MUST be stable
  // (a module function or useCallback) — the load effect keys on it.
  getPlan: () => Promise<Order>;
  updatePlan: (data: PartialOrder) => Promise<Order>;
  onSaveNavigateTo: string;
  /** Where to go if the order can't be loaded. */
  backPath: string;
  /** Toast shown after a successful save in edit mode. */
  savedMessage?: string;
  loadErrorMessage: string;
  saveErrorMessage: string;
}

/**
 * The shared load/save lifecycle behind the order editors: fetch the order once,
 * map it into form state, and save a payload back. Only getPlan and router drive
 * the load effect; the rest of the config is read through a ref so passing inline
 * callbacks does not retrigger the fetch.
 */
export function usePlanEditor<T>(config: UsePlanEditorConfig<T>) {
  const router = useRouter();
  const [formData, setFormData] = useState<T>(config.initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const configRef = useRef(config);
  configRef.current = config;

  const { getPlan } = config;
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getPlan()
      .then((plan) => {
        if (!cancelled) setFormData(configRef.current.fromPlan(plan));
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(configRef.current.loadErrorMessage, { description: errorMessage(err) });
        router.push(configRef.current.backPath);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [getPlan, router]);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    const cfg = configRef.current;
    if (cfg.validate) {
      const problem = cfg.validate(formData);
      if (problem) {
        toast.error(problem);
        return;
      }
    }
    setIsSaving(true);
    try {
      await cfg.updatePlan(cfg.toPayload(formData));
      if (cfg.mode === 'edit' && cfg.savedMessage) {
        toast.success(cfg.savedMessage);
      }
      router.push(cfg.onSaveNavigateTo);
    } catch (err) {
      toast.error(cfg.saveErrorMessage, { description: errorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  };

  return { formData, setField, isLoading, isSaving, handleSave };
}
