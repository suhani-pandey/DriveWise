'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

/**
 * Browse filter state, synced to the URL so searches are shareable,
 * bookmarkable and survive reloads. Array filters are comma-separated —
 * the API accepts the same encoding.
 */

export const ARRAY_KEYS = [
  'conditions',
  'makes',
  'fuelTypes',
  'bodyTypes',
  'transmissions',
  'drivetrains',
  'regions',
  'sellerTypes',
] as const;

export const SCALAR_KEYS = [
  'q',
  'priceMinDkk',
  'priceMaxDkk',
  'leaseMaxDkk',
  'yearMin',
  'yearMax',
  'mileageMaxKm',
  'seatsMin',
  'evRangeMinKm',
  'euroNcapMin',
  'registrationTaxPaid',
  'sort',
] as const;

export type ArrayFilterKey = (typeof ARRAY_KEYS)[number];
export type ScalarFilterKey = (typeof SCALAR_KEYS)[number];

export function useVehicleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete('page'); // any filter change resets pagination
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const getScalar = useCallback(
    (key: ScalarFilterKey): string | null => searchParams.get(key),
    [searchParams],
  );

  const getArray = useCallback(
    (key: ArrayFilterKey): string[] => {
      const raw = searchParams.get(key);
      return raw ? raw.split(',').filter(Boolean) : [];
    },
    [searchParams],
  );

  const setScalar = useCallback(
    (key: ScalarFilterKey, value: string | null) => {
      replaceParams((params) => {
        if (value === null || value === '') params.delete(key);
        else params.set(key, value);
      });
    },
    [replaceParams],
  );

  const toggleArrayValue = useCallback(
    (key: ArrayFilterKey, value: string) => {
      replaceParams((params) => {
        const current = params.get(key)?.split(',').filter(Boolean) ?? [];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        if (next.length === 0) params.delete(key);
        else params.set(key, next.join(','));
      });
    },
    [replaceParams],
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  /** Params to forward to the browse API (URL params map 1:1 to the contract). */
  const apiSearchParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return params;
  }, [searchParams]);

  const activeCount = useMemo(() => {
    let count = 0;
    for (const key of ARRAY_KEYS) count += getArray(key).length;
    for (const key of SCALAR_KEYS) {
      if (key === 'sort' || key === 'q') continue; // sort/search aren't "filters"
      if (getScalar(key) !== null) count += 1;
    }
    return count;
  }, [getArray, getScalar]);

  return {
    getScalar,
    getArray,
    setScalar,
    toggleArrayValue,
    clearAll,
    apiSearchParams,
    activeCount,
  };
}

export type VehicleFiltersApi = ReturnType<typeof useVehicleFilters>;
