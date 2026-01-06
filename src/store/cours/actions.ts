import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api.config';
import type { CourseFormData, CourseLevel } from '../../types';
import { toast } from 'react-toastify';

// Get all courses
export const getAllCourses = createAsyncThunk(
  'courses/getAll',
  async (filters: { level?: CourseLevel; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/courses?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Get course by ID
export const getCourseById = createAsyncThunk(
  'courses/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Cours introuvable');
    }
  }
);

// Get courses by current user
export const getCoursesByUser = createAsyncThunk(
  'courses/getByUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/user/courses`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Get courses by level
export const getCoursesByLevel = createAsyncThunk(
  'courses/getByLevel',
  async (level: CourseLevel, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/level/${level}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Create course (admin)
export const createCourse = createAsyncThunk(
  'courses/create',
  async (data: CourseFormData, { rejectWithValue }) => {
    try {
      const payload = {
        ...data,
        objectives: JSON.stringify(data.objectives),
      };

      const response = await api.post('/courses', payload);
      toast.success('Cours créé avec succès');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de création');
    }
  }
);

// Update course (admin)
export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }: { id: string; data: Partial<CourseFormData> }, { rejectWithValue }) => {
    try {
      const payload: any = { ...data };
      if (data.objectives) {
        payload.objectives = JSON.stringify(data.objectives);
      }

      const response = await api.put(`/courses/${id}`, payload);
      toast.success('Cours mis à jour');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Delete course (admin)
export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Cours supprimé');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);

// Search courses
export const searchCourses = createAsyncThunk(
  'courses/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/search?q=${query}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de recherche');
    }
  }
);
