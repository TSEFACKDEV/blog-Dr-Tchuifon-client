import { createSlice } from '@reduxjs/toolkit';
import type { PublicationsState } from '../../types';
import {
  getAllPublications,
  getPublicationBySlug,
  getPublicationById,
  getMyPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from './actions';

const initialState: PublicationsState = {
  publications: [],
  currentPublication: null,
  pagination: null,
  loading: false,
  error: null,
};

const publicationsSlice = createSlice({
  name: 'publications',
  initialState,
  reducers: {
    clearCurrentPublication: (state) => {
      state.currentPublication = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all publications
    builder
      .addCase(getAllPublications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPublications.fulfilled, (state, action) => {
        state.loading = false;
        state.publications = action.payload.publications || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllPublications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get publication by slug
    builder
      .addCase(getPublicationBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicationBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPublication = action.payload;
      })
      .addCase(getPublicationBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get publication by ID
    builder
      .addCase(getPublicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPublication = action.payload;
      })
      .addCase(getPublicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get my publications
    builder
      .addCase(getMyPublications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyPublications.fulfilled, (state, action) => {
        state.loading = false;
        state.publications = action.payload;
      })
      .addCase(getMyPublications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create publication
    builder
      .addCase(createPublication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPublication.fulfilled, (state, action) => {
        state.loading = false;
        state.publications.unshift(action.payload);
      })
      .addCase(createPublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update publication
    builder
      .addCase(updatePublication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePublication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.publications.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.publications[index] = action.payload;
        }
        if (state.currentPublication?.id === action.payload.id) {
          state.currentPublication = action.payload;
        }
      })
      .addCase(updatePublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete publication
    builder
      .addCase(deletePublication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePublication.fulfilled, (state, action) => {
        state.loading = false;
        state.publications = state.publications.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentPublication, clearError } = publicationsSlice.actions;
export default publicationsSlice.reducer;
