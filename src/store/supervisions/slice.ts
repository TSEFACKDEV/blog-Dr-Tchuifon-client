import { createSlice } from '@reduxjs/toolkit';
import type { SupervisionsState } from '../../types';
import {
  getAllSupervisions,
  getSupervisionById,
  getMySupervisions,
  createSupervision,
  updateSupervision,
  deleteSupervision,
} from './actions';

const initialState: SupervisionsState = {
  supervisions: [],
  currentSupervision: null,
  pagination: null,
  loading: false,
  error: null,
};

const supervisionsSlice = createSlice({
  name: 'supervisions',
  initialState,
  reducers: {
    clearCurrentSupervision: (state) => {
      state.currentSupervision = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all supervisions
    builder
      .addCase(getAllSupervisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSupervisions.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisions = action.payload.supervisions || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllSupervisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get supervision by ID
    builder
      .addCase(getSupervisionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupervisionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupervision = action.payload;
      })
      .addCase(getSupervisionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get my supervisions
    builder
      .addCase(getMySupervisions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMySupervisions.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisions = action.payload;
      })
      .addCase(getMySupervisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create supervision
    builder
      .addCase(createSupervision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupervision.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisions.unshift(action.payload);
      })
      .addCase(createSupervision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update supervision
    builder
      .addCase(updateSupervision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupervision.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.supervisions.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.supervisions[index] = action.payload;
        }
        if (state.currentSupervision?.id === action.payload.id) {
          state.currentSupervision = action.payload;
        }
      })
      .addCase(updateSupervision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete supervision
    builder
      .addCase(deleteSupervision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupervision.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisions = state.supervisions.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSupervision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentSupervision, clearError } = supervisionsSlice.actions;
export default supervisionsSlice.reducer;
