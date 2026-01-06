import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/api.config';
import type { ContactFormData } from '../../types';
import { toast } from 'react-toastify';

// Send contact message (public)
export const sendContactMessage = createAsyncThunk(
  'contact/send',
  async (data: ContactFormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact', data);
      toast.success('Message envoyé avec succès');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur d\'envoi');
    }
  }
);

// Get all messages (admin)
export const getAllContactMessages = createAsyncThunk(
  'contact/getAll',
  async (filters: { isRead?: boolean; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/contact?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);

// Get message by ID (admin)
export const getContactMessageById = createAsyncThunk(
  'contact/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Message introuvable');
    }
  }
);

// Mark message as read (admin)
export const markMessageAsRead = createAsyncThunk(
  'contact/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contact/${id}/read`);
      toast.success('Message marqué comme lu');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Mark message as unread (admin)
export const markMessageAsUnread = createAsyncThunk(
  'contact/markAsUnread',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contact/${id}/unread`);
      toast.success('Message marqué comme non lu');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de mise à jour');
    }
  }
);

// Delete message (admin)
export const deleteContactMessage = createAsyncThunk(
  'contact/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message supprimé');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de suppression');
    }
  }
);

// Get contact stats (admin)
export const getContactStats = createAsyncThunk(
  'contact/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact/stats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur de récupération');
    }
  }
);
