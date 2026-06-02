/**
 * dataProvider.ts
 * Custom data provider for react-admin that works with the EventSync Next.js API.
 *
 * The API follows this convention:
 *   GET    /api/{resource}?_start=0&_end=10&_sort=id&_order=ASC
 *   GET    /api/{resource}/{id}
 *   POST   /api/{resource}
 *   PUT    /api/{resource}/{id}
 *   DELETE /api/{resource}/{id}
 *
 * Responses:
 *   List:   { data: [...], meta: { total: number } }
 *   Single: { data: {...} }
 */

import type { DataProvider, GetListParams, GetOneParams, CreateParams, UpdateParams, DeleteParams, DeleteManyParams, GetManyParams, GetManyReferenceParams } from "react-admin";

const API_BASE = "/api";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {};
    const { field = "id", order = "ASC" } = params.sort ?? {};

    const query = new URLSearchParams({
      _start: String((page - 1) * perPage),
      _end: String(page * perPage),
      _sort: field,
      _order: order,
    });

    if (params.filter) {
      for (const [key, value] of Object.entries(params.filter)) {
        if (value !== undefined && value !== null && value !== "") {
          query.set(key, String(value));
        }
      }
    }

    const json = await apiFetch(`${API_BASE}/${resource}?${query}`);
    const data = json.data ?? json;
    const total = json.meta?.total ?? (Array.isArray(data) ? data.length : 0);
    return { data, total };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const json = await apiFetch(`${API_BASE}/${resource}/${params.id}`);
    return { data: json.data ?? json };
  },
  getMany: async (resource: string, params: GetManyParams) => {
    const results = await Promise.all(
      params.ids.map((id) =>
        apiFetch(`${API_BASE}/${resource}/${id}`).then((j) => j.data ?? j)
      )
    );
    return { data: results };
  },

  getManyReference: async (resource: string, params: GetManyReferenceParams) => {
    const { page = 1, perPage = 10 } = params.pagination ?? {};
    const { field = "id", order = "ASC" } = params.sort ?? {};

    const query = new URLSearchParams({
      _start: String((page - 1) * perPage),
      _end: String(page * perPage),
      _sort: field,
      _order: order,
      [params.target]: String(params.id),
    });

    if (params.filter) {
      for (const [key, value] of Object.entries(params.filter)) {
        if (value !== undefined && value !== null && value !== "") {
          query.set(key, String(value));
        }
      }
    }

    const json = await apiFetch(`${API_BASE}/${resource}?${query}`);
    const data = json.data ?? json;
    const total = json.meta?.total ?? (Array.isArray(data) ? data.length : 0);
    return { data, total };
  },

  create: async (resource: string, params: CreateParams) => {
    const json = await apiFetch(`${API_BASE}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
    return { data: json.data ?? json };
  },

  update: async (resource: string, params: UpdateParams) => {
    const json = await apiFetch(`${API_BASE}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    });
    return { data: json.data ?? json };
  },

  updateMany: async (resource: string, params: { ids: (string | number)[]; data: Record<string, unknown> }) => {
    await Promise.all(
      params.ids.map((id) =>
        apiFetch(`${API_BASE}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    );
    return { data: params.ids };
  },

  delete: async (resource: string, params: DeleteParams) => {
    const json = await apiFetch(`${API_BASE}/${resource}/${params.id}`, {
      method: "DELETE",
    });
    return { data: json.data ?? { id: params.id } };
  },

  deleteMany: async (resource: string, params: DeleteManyParams) => {
    await Promise.all(
      params.ids.map((id) =>
        apiFetch(`${API_BASE}/${resource}/${id}`, { method: "DELETE" })
      )
    );
    return { data: params.ids };
  },
};