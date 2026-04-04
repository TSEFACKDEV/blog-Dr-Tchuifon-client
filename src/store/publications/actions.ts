import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiFormData } from '../../config/api.config';
import type { PublicationFormData, PublicationFilters } from '../../types';
import { toast } from 'react-toastify';

/**
 * Récupère toutes les publications publiées avec filtres et pagination
 */
export const getAllPublications = createAsyncThunk(
  'publications/getAll',
  async (filters: PublicationFilters = { limit: 0 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      // Ajouter les filtres si présents
      if (filters.type) params.append('type', filters.type);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.keywords) params.append('keywords', filters.keywords);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await api.get(`/publications?${params.toString()}`);
      
      // La nouvelle structure retourne les données directement avec pagination séparée
      return {
        publications: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de la récupération des publications';
      return rejectWithValue(message);
    }
  }
);

// Get publication by slug
export const getPublicationBySlug = createAsyncThunk(
  'publications/getBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/publications/slug/${slug}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Publication introuvable');
    }
  }
);

// Get publication by ID
export const getPublicationById = createAsyncThunk(
  'publications/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/publications/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Publication introuvable');
    }
  }
);

// Get my publications (admin)
export const getMyPublications = createAsyncThunk(
  'publications/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/publications/user/me');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Create publication (admin)
export const createPublication = createAsyncThunk(
  'publications/create',
  async (data: PublicationFormData, { rejectWithValue }) => {
    try {
      // Si pas de PDF, envoyer JSON simple
      if (!data.pdf) {
        const payload: any = {
          title: data.title,
          abstract: data.abstract,
          authors: data.authors,
          journal: data.journal,
          conference: data.conference,
          publicationDate: data.publicationDate,
          year: data.year,
          volume: data.volume,
          issue: data.issue,
          pages: data.pages,
          publisher: data.publisher,
          doi: data.doi,
          isbn: data.isbn,
          issn: data.issn,
          type: data.type,
          keywords: data.keywords,
          citations: data.citations,
          isPublished: data.isPublished,
        };
        const response = await api.post('/publications', payload);
        toast.success('Publication créée avec succès');
        return response.data.data;
      }

      // Si PDF, utiliser FormData
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof PublicationFormData];
        if (value !== undefined && value !== null && key !== 'pdf') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Ajouter le PDF si présent
      if (data.pdf) {
        formData.append('pdf', data.pdf);
      }

      const response = await apiFormData.post('/publications', formData);
      toast.success('Publication créée avec succès');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

// Update publication (admin)
export const updatePublication = createAsyncThunk(
  'publications/update',
  async ({ id, data }: { id: string; data: Partial<PublicationFormData> }, { rejectWithValue }) => {
    try {
      // Si pas de PDF, envoyer JSON simple
      if (!data.pdf) {
        const payload: any = {
          title: data.title,
          abstract: data.abstract,
          authors: data.authors,
          journal: data.journal,
          conference: data.conference,
          publicationDate: data.publicationDate,
          year: data.year,
          volume: data.volume,
          issue: data.issue,
          pages: data.pages,
          publisher: data.publisher,
          doi: data.doi,
          isbn: data.isbn,
          issn: data.issn,
          type: data.type,
          keywords: data.keywords,
          citations: data.citations,
          isPublished: data.isPublished,
        };
        const response = await api.put(`/publications/${id}`, payload);
        toast.success('Publication mise à jour');
        return response.data.data;
      }

      // Si PDF, utiliser FormData
      const formData = new FormData();
      
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof PublicationFormData];
        if (value !== undefined && value !== null && key !== 'pdf') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      if (data.pdf) {
        formData.append('pdf', data.pdf);
      }

      const response = await apiFormData.put(`/publications/${id}`, formData);
      toast.success('Publication mise à jour');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Delete publication (admin)
export const deletePublication = createAsyncThunk(
  'publications/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/publications/${id}`);
      toast.success('Publication supprimée');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);
