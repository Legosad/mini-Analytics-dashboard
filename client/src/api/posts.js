import { api } from "./client";

export const PostsAPI = {
  list: (qs = "") => api(`/api/posts${qs ? `?${qs}` : ""}`),
  get: (id) => api(`/api/posts/${id}`),
  create: (payload) =>
    api("/api/posts", { method: "POST", body: payload, auth: true }),
  update: (id, payload) =>
    api(`/api/posts/${id}`, { method: "PUT", body: payload, auth: true }),
  remove: (id) => api(`/api/posts/${id}`, { method: "DELETE", auth: true }),
};
