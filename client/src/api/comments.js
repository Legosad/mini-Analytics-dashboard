import { api } from "./client";

export const CommentsAPI = {
  listByPost: async (postId) => {
    const res = await api(`/api/comments/${postId}`);
    // if controller returns {success, data:[...]} return the array; otherwise return as-is
    return Array.isArray(res) ? res : res.data ?? [];
  },
  create: (postId, payload) =>
    api(`/api/comments/${postId}`, {
      method: "POST",
      body: payload,
      auth: true,
    }),
  remove: (commentId) =>
    api(`/api/comments/${commentId}`, { method: "DELETE", auth: true }),
};
