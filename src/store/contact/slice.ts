import { createSlice } from '@reduxjs/toolkit';
import type { ContactState } from '../../types';
import {
  sendContactMessage,
  getAllContactMessages,
  getContactMessageById,
  markMessageAsRead,
  markMessageAsUnread,
  deleteContactMessage,
  getContactStats,
} from './actions';

const initialState: ContactState = {
  messages: [],
  currentMessage: null,
  stats: null,
  pagination: null,
  loading: false,
  error: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    clearCurrentMessage: (state) => {
      state.currentMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send message
    builder
      .addCase(sendContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendContactMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get all messages
    builder
      .addCase(getAllContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get message by ID
    builder
      .addCase(getContactMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactMessageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMessage = action.payload;
      })
      .addCase(getContactMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark as read
    builder
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.currentMessage?.id === action.payload.id) {
          state.currentMessage = action.payload;
        }
      });

    // Mark as unread
    builder
      .addCase(markMessageAsUnread.fulfilled, (state, action) => {
        const index = state.messages.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.currentMessage?.id === action.payload.id) {
          state.currentMessage = action.payload;
        }
      });

    // Delete message
    builder
      .addCase(deleteContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContactMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get stats
    builder
      .addCase(getContactStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getContactStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentMessage, clearError } = contactSlice.actions;
export default contactSlice.reducer;
