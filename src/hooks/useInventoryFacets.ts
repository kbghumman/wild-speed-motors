"use client";

import { useEffect, useState } from "react";
import {
  emptyFacetSelections,
  type FacetKey,
  type FacetSelections,
  type InventoryFacetResponse,
} from "@/lib/inventory-facets";

const emptyResponse: InventoryFacetResponse = {
  total: 0,
  facets: {
    make: [],
    model: [],
    body: [],
    transmission: [],
    fuel: [],
    seats: [],
    budget: [],
  },
};

export function useInventoryFacets(initial?: Partial<FacetSelections>) {
  const [selections, setSelections] = useState<FacetSelections>({
    ...emptyFacetSelections,
    ...initial,
  });
  const [data, setData] = useState<InventoryFacetResponse>(emptyResponse);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(selections)) {
      if (value) params.set(key, value);
    }

    setLoading(true);

    fetch("/api/inventory-facets?" + params.toString(), {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load live inventory filters.");
        return response.json() as Promise<InventoryFacetResponse>;
      })
      .then((next) => {
        setData(next);

        setSelections((current) => {
          const updated = { ...current };
          let changed = false;

          const keys: FacetKey[] = [
            "make",
            "model",
            "body",
            "transmission",
            "fuel",
            "seats",
            "budget",
          ];

          for (const key of keys) {
            if (!updated[key]) continue;
            const stillPossible = next.facets[key].some(
              (option) => option.value === updated[key],
            );
            if (!stillPossible) {
              updated[key] = "";
              if (key === "make") updated.model = "";
              changed = true;
            }
          }

          return changed ? updated : current;
        });
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setData(emptyResponse);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selections]);

  function setSelection(key: FacetKey, value: string) {
    setSelections((current) => ({
      ...current,
      [key]: value,
      ...(key === "make" ? { model: "" } : {}),
    }));
  }

  return { selections, setSelection, data, loading };
}
