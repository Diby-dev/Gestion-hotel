import axios from 'axios';

// URL de base de l'API (avec fallback sur le serveur Render)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hotel-api-dy9o.onrender.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Injection automatique du token Bearer dans toutes les requêtes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Types
export interface User {
  id: number;
  parent_id?: number | null;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  role: 'super_admin' | 'admin' | 'gerant' | 'client';
  photo?: string | null;
  statut: 'actif' | 'inactif';
  created_at?: string;
  updated_at?: string;
}

export interface HotelData {
  id: number;
  admin_id?: number;
  nom: string;
  description?: string | null;
  logo?: string | null;
  quartier?: string | null;
  ville?: string | null;
  adresse?: string | null;
  lien_google_map?: string | null;
  telephone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  horaires?: string | null;
  statut?: 'en_attente' | 'valide' | 'suspendu' | 'rejete';
  created_at?: string;
  updated_at?: string;
  admin?: User;
  chambres?: ChambreData[];
}

export interface ChambreData {
  id: number;
  hotel_id: number;
  admin_id?: number;
  numero_chambre: string;
  prix_heure?: number | null;
  prix_nuit: number;
  image?: string | null;
  capacite?: number;
  description?: string | null;
  statut?: 'disponible' | 'reservee' | 'occupee' | 'maintenance' | 'indisponible';
  created_at?: string;
  updated_at?: string;
  hotel?: HotelData;
}

export interface ReservationData {
  id: number;
  numero_reservation?: string;
  client_id?: number;
  hotel_id?: number;
  chambre_id: number;
  date_arrivee: string;
  date_depart: string;
  nombre_personnes: number;
  nombre_nuits?: number;
  montant_total?: number;
  acompte?: number;
  statut?: 'en_attente' | 'confirmee' | 'client_arrive' | 'terminee' | 'annulee' | 'non_presente';
  created_at?: string;
  client?: User;
  hotel?: HotelData;
  chambre?: ChambreData;
}

// ---------------- AUTH SERVICE ----------------
export const authService = {
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post<{ user: User; token: string }>('/api/login', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async register(data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    password_confirmation: string;
    role?: 'client' | 'admin';
  }) {
    const res = await apiClient.post<{ user: User; token: string }>('/api/register', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async registerSuperAdmin(data: {
    cle: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    password_confirmation: string;
  }) {
    const res = await apiClient.post<{ user: User; token: string }>('/api/register-super-admin', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout() {
    try {
      await apiClient.post('/api/logout');
    } catch (e) {
      console.warn('Erreur lors du logout API:', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const res = await apiClient.get<User>('/api/user');
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  },

  async updateProfile(data: {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    photo?: string;
  }) {
    const res = await apiClient.put<User>('/api/user', data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  },

  async updatePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    const res = await apiClient.put<{ user: User; token: string }>('/api/user/password', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  },

  getUser(): User | null {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

// ---------------- HOTEL SERVICE ----------------
export const hotelService = {
  async getAll() {
    const res = await apiClient.get<HotelData[]>('/api/hotel');
    return res.data;
  },

  async getById(id: number | string) {
    const res = await apiClient.get<HotelData>(`/api/hotel/${id}`);
    return res.data;
  },

  async create(data: {
    nom: string;
    description?: string;
    logo?: string;
    quartier?: string;
    ville?: string;
    adresse?: string;
    lien_google_map?: string;
    telephone?: string;
    whatsapp?: string;
    email?: string;
    horaires?: string;
    statut?: 'en_attente' | 'valide' | 'suspendu' | 'rejete';
  }) {
    const res = await apiClient.post<HotelData>('/api/hotel', data);
    return res.data;
  },

  async update(id: number | string, data: Partial<HotelData>) {
    const res = await apiClient.put<HotelData>(`/api/hotel/${id}`, data);
    return res.data;
  },

  async delete(id: number | string) {
    const res = await apiClient.delete(`/api/hotel/${id}`);
    return res.data;
  },
};

// ---------------- ROOM (CHAMBRE) SERVICE ----------------
export const roomService = {
  async getAll() {
    const res = await apiClient.get<ChambreData[]>('/api/chambre');
    return res.data;
  },

  async getById(id: number | string) {
    const res = await apiClient.get<ChambreData>(`/api/chambre/${id}`);
    return res.data;
  },

  // Note API: Ne pas envoyer de champ "type" car aucune colonne en base
  async create(data: {
    hotel_id: number;
    numero_chambre: string;
    prix_heure?: number;
    prix_nuit: number;
    image?: string;
    capacite?: number;
    description?: string;
    statut?: 'disponible' | 'reservee' | 'occupee' | 'maintenance' | 'indisponible';
  }) {
    const res = await apiClient.post<ChambreData>('/api/chambre', data);
    return res.data;
  },

  async update(id: number | string, data: Partial<ChambreData>) {
    // Retirer 'type' s'il existe pour éviter l'erreur SQL documentée
    const payload = { ...data };
    delete (payload as Record<string, unknown>).type;
    const res = await apiClient.put<ChambreData>(`/api/chambre/${id}`, payload);
    return res.data;
  },

  async delete(id: number | string) {
    const res = await apiClient.delete(`/api/chambre/${id}`);
    return res.data;
  },
};

// ---------------- RESERVATION SERVICE ----------------
export const reservationService = {
  // Côté Client
  async create(data: {
    chambre_id: number;
    date_arrivee: string;
    date_depart: string;
    nombre_personnes: number;
    acompte?: number;
  }) {
    const res = await apiClient.post<ReservationData>('/api/client/reservations', data);
    return res.data;
  },

  async getClientReservations() {
    const res = await apiClient.get<ReservationData[]>('/api/client/reservations');
    return res.data;
  },

  async getClientHistory(statut?: string) {
    const res = await apiClient.get<ReservationData[]>('/api/client/reservations/historique', {
      params: statut ? { statut } : {},
    });
    return res.data;
  },

  async cancelClientReservation(id: number | string) {
    const res = await apiClient.post<ReservationData>(`/api/client/reservations/${id}/annuler`);
    return res.data;
  },

  // Côté Gérant / Admin d'hôtel
  async getGerantReservations(statut?: string) {
    const res = await apiClient.get<ReservationData[]>('/api/gerant/reservations', {
      params: statut ? { statut } : {},
    });
    return res.data;
  },

  async updateGerantStatus(id: number | string, statut: 'confirmee' | 'client_arrive' | 'terminee' | 'annulee') {
    const res = await apiClient.put<ReservationData>(`/api/gerant/reservations/${id}`, { statut });
    return res.data;
  },

  async cancelGerantReservation(id: number | string) {
    const res = await apiClient.post<ReservationData>(`/api/gerant/reservations/${id}/annuler`);
    return res.data;
  },
};

// ---------------- SUPER ADMIN SERVICE ----------------
export const superAdminService = {
  async getUsers(params?: { role?: 'admin' | 'gerant' | 'client'; statut?: 'actif' | 'inactif' }) {
    const res = await apiClient.get<User[]>('/api/super-admin/users', { params });
    return res.data;
  },

  async createUser(data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    password_confirmation: string;
    role: 'admin' | 'gerant' | 'client';
    statut?: 'actif' | 'inactif';
  }) {
    const res = await apiClient.post<User>('/api/super-admin/users', data);
    return res.data;
  },

  async getUser(id: number | string) {
    const res = await apiClient.get<User>(`/api/super-admin/users/${id}`);
    return res.data;
  },

  async updateUser(id: number | string, data: Partial<User> & { password?: string; password_confirmation?: string }) {
    const res = await apiClient.put<User>(`/api/super-admin/users/${id}`, data);
    return res.data;
  },

  async deactivateUser(id: number | string) {
    const res = await apiClient.delete<User>(`/api/super-admin/users/${id}`);
    return res.data;
  },
};
