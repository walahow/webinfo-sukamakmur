// API Helper Functions for Admin Pages

export async function apiCall<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: Record<string, any>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data || result,
    };
  } catch (error) {
    console.error(`API ${method} ${endpoint} error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// News API
export const newsAPI = {
  getAll: (page = 1, limit = 10) =>
    apiCall("GET", `/api/news?page=${page}&limit=${limit}`),
  getBySlug: (slug: string) => apiCall("GET", `/api/news/${slug}`),
  create: (data: any) => apiCall("POST", "/api/news", data),
  update: (slug: string, data: any) => apiCall("PUT", `/api/news/${slug}`, data),
  delete: (slug: string) => apiCall("DELETE", `/api/news/${slug}`),
};

// Katalog API
export const katalogAPI = {
  getAll: (page = 1, limit = 12, category?: string, search?: string) => {
    let url = `/api/katalog?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    return apiCall("GET", url);
  },
  getById: (id: string) => apiCall("GET", `/api/katalog/${id}`),
  getCategories: () => apiCall("GET", "/api/katalog/categories"),
  create: (data: any) => apiCall("POST", "/api/katalog", data),
  update: (id: string, data: any) => apiCall("PUT", `/api/katalog/${id}`, data),
  delete: (id: string) => apiCall("DELETE", `/api/katalog/${id}`),
};

// Documents API
export const documentsAPI = {
  getAll: (category?: string) => {
    let url = "/api/documents";
    if (category) url += `?category=${category}`;
    return apiCall("GET", url);
  },
  getById: (id: string) => apiCall("GET", `/api/documents/${id}`),
  getCategories: () => apiCall("GET", "/api/documents/categories"),
  create: (data: any) => apiCall("POST", "/api/documents", data),
  update: (id: string, data: any) => apiCall("PUT", `/api/documents/${id}`, data),
  delete: (id: string) => apiCall("DELETE", `/api/documents/${id}`),
};

// Profile API
export const profileAPI = {
  get: () => apiCall("GET", "/api/profile"),
  update: (data: any) => apiCall("PUT", "/api/profile", data),
  
  // Struktur/Aparatur
  getStruktur: () => apiCall("GET", "/api/profile/struktur"),
  getStrukturById: (id: string) => apiCall("GET", `/api/profile/struktur/${id}`),
  createStruktur: (data: any) => apiCall("POST", "/api/profile/struktur", data),
  updateStruktur: (id: string, data: any) =>
    apiCall("PUT", `/api/profile/struktur/${id}`, data),
  deleteStruktur: (id: string) => apiCall("DELETE", `/api/profile/struktur/${id}`),
};

// Infografis API
export const infografisAPI = {
  getAll: (tahun?: number) => {
    let url = "/api/infografis";
    if (tahun) url += `?tahun=${tahun}`;
    return apiCall("GET", url);
  },

  // Penduduk
  getPenduduk: (tahun?: number) => {
    let url = "/api/infografis/penduduk";
    if (tahun) url += `?tahun=${tahun}`;
    return apiCall("GET", url);
  },
  createPenduduk: (data: any) => apiCall("POST", "/api/infografis/penduduk", data),
  updatePenduduk: (data: any) => apiCall("PUT", "/api/infografis/penduduk", data),
  deletePenduduk: (id: string) =>
    apiCall("DELETE", "/api/infografis/penduduk", { id }),

  // APBDES
  getApbdes: (tahun?: number) => {
    let url = "/api/infografis/apbdes";
    if (tahun) url += `?tahun=${tahun}`;
    return apiCall("GET", url);
  },
  createApbdes: (data: any) => apiCall("POST", "/api/infografis/apbdes", data),
  updateApbdes: (data: any) => apiCall("PUT", "/api/infografis/apbdes", data),
  deleteApbdes: (id: string) =>
    apiCall("DELETE", "/api/infografis/apbdes", { id }),

  // IDM SDG
  getIdmSdg: (tahun?: number) => {
    let url = "/api/infografis/idm-sdg";
    if (tahun) url += `?tahun=${tahun}`;
    return apiCall("GET", url);
  },
  createIdmSdg: (data: any) => apiCall("POST", "/api/infografis/idm-sdg", data),
  updateIdmSdg: (data: any) => apiCall("PUT", "/api/infografis/idm-sdg", data),
  deleteIdmSdg: (id: string) =>
    apiCall("DELETE", "/api/infografis/idm-sdg", { id }),

  // Stunting Bansos
  getStunting: (tahun?: number) => {
    let url = "/api/infografis/stunting";
    if (tahun) url += `?tahun=${tahun}`;
    return apiCall("GET", url);
  },
  createStunting: (data: any) =>
    apiCall("POST", "/api/infografis/stunting", data),
  updateStunting: (data: any) =>
    apiCall("PUT", "/api/infografis/stunting", data),
  deleteStunting: (id: string) =>
    apiCall("DELETE", "/api/infografis/stunting", { id }),
};
