"use client";

import { useState, useEffect } from "react";

type PaginationMeta = {
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
};

type UsePaginatedFetchOptions<T> = {
  fetchFn: (page: number, pageSize: number, search: string) => Promise<any>;
  setItems: (items: T[]) => void;
};

export function usePaginatedFetch<T>({ fetchFn, setItems }: UsePaginatedFetchOptions<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const delay = search.trim() ? 400 : 0;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchFn(page, pageSize, search);
        const list = Array.isArray(data) ? data : (data.results ?? []);
        const pagination: PaginationMeta = data.pagination ?? {};
        setTotalCount(pagination.total_count ?? list.length);
        setTotalPages(pagination.total_pages ?? 1);
        setHasNext(pagination.has_next ?? false);
        setHasPrev(pagination.has_previous ?? false);
        setItems(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [page, pageSize, search]);

  const onSearch = (value: string) => { setSearch(value); setPage(1); };
  const onPageSizeChange = (value: number) => { setPageSize(value); setPage(1); };

  return {
    search, onSearch,
    page, setPage,
    pageSize, onPageSizeChange,
    loading,
    totalCount, totalPages, hasNext, hasPrev,
  };
}
