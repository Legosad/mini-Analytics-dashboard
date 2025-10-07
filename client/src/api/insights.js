import { api } from "./client";

export const InsightsAPI = {
  overview: (days = 7) => api(`/api/insights/overview?days=${days}`),
  topPosts: (limit = 5) => api(`/api/insights/top-posts?limit=${limit}`),
  recent: (limit = 10) => api(`/api/insights/recent-activity?limit=${limit}`),
};
