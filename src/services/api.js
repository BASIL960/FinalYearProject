const BASE_URL = 'https://backend.lytrex.fuzte.com';

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

const saveTokens = ({ access, refresh }) => {
      localStorage.setItem('access_token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
};

// ---------------------------------------------------------------------------
// Base fetch wrapper with automatic token refresh
// ---------------------------------------------------------------------------
const request = async (url, options = {}) => {
      const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

      const accessToken = getAccessToken();
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      let response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

      // If 401 → try to refresh once then retry
      if (response.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                  headers['Authorization'] = `Bearer ${getAccessToken()}`;
                  response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
            }
      }

      return response;
};

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------

/** Register a new user (individual or organization) */
export const register = async (userData) => {
      // Map frontend 'individual'/'organization' → API 'INDIVIDUAL'/'ORGANIZATION'
      const body = { ...userData, user_type: userData.user_type.toUpperCase() };

      const res = await fetch(`${BASE_URL}/authentication/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      saveTokens(data.tokens);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
};

/** Login with username + password */
export const login = async (username, password) => {
      const res = await fetch(`${BASE_URL}/authentication/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      saveTokens(data.tokens);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
};

/** Silently refresh access token using the stored refresh token */
export const refreshAccessToken = async () => {
      const refresh = getRefreshToken();
      if (!refresh) return false;

      const res = await fetch(`${BASE_URL}/authentication/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
            clearTokens();
            return false;
      }

      const data = await res.json();
      saveTokens({ access: data.access, refresh: data.refresh || refresh });
      return true;
};

/** Logout – blacklists the refresh token */
export const logout = async () => {
      const refresh = getRefreshToken();
      try {
            await request('/authentication/logout/', {
                  method: 'POST',
                  body: JSON.stringify({ refresh }),
            });
      } finally {
            clearTokens();
      }
};

// ---------------------------------------------------------------------------
// Compliance Auditor API
// ---------------------------------------------------------------------------

/**
 * Submit a PDF for compliance auditing.
 * @param {File}    file         - The PDF file object from the file input
 * @param {number}  frameworkId  - 1 = ECC, 2 = NCA, 3 = SAMA
 * @param {boolean} detailed     - Whether to get a detailed response (default true)
 */
export const matchCompliance = async (file, frameworkId, detailed = true) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('framework_id', frameworkId);
      formData.append('detailed', detailed);

      // Don't set Content-Type — browser sets it automatically with the correct boundary
      const accessToken = getAccessToken();
      const headers = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      let res = await fetch(`${BASE_URL}/auditor/match-compliance`, {
            method: 'POST',
            headers,
            body: formData,
      });

      // Auto-refresh once if 401
      if (res.status === 401) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                  headers['Authorization'] = `Bearer ${getAccessToken()}`;
                  res = await fetch(`${BASE_URL}/auditor/match-compliance`, {
                        method: 'POST',
                        headers,
                        body: formData,
                  });
            }
      }

      const data = await res.json();
      if (!res.ok) throw data;
      return data;
};

// ---------------------------------------------------------------------------
// Compliance Records API
// ---------------------------------------------------------------------------

/** Get all compliance records for the logged-in user */
export const getComplianceRecords = async () => {
      const res = await request('/auditor/compliance-records/all');
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
};

/** Get full detail for a single compliance record */
export const getComplianceRecord = async (id) => {
      const res = await request(`/auditor/compliance-records/${id}`);
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
};

// Default export for authenticated requests to other endpoints
export default request;
