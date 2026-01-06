import { createSlice } from '@reduxjs/toolkit';
import type { CollaboratorsState } from '../../types';
import {
  getAllCollaborators,
  getCollaboratorById,
  getMyCollaborators,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator,
  linkCollaboratorToPublication,
  unlinkCollaboratorFromPublication,
} from './actions';

const initialState: CollaboratorsState = {
  collaborators: [],
  currentCollaborator: null,
  pagination: null,
  loading: false,
  error: null,
};

const collaboratorsSlice = createSlice({
  name: 'collaborators',
  initialState,
  reducers: {
    clearCurrentCollaborator: (state) => {
      state.currentCollaborator = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all collaborators
    builder
      .addCase(getAllCollaborators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCollaborators.fulfilled, (state, action) => {
        state.loading = false;
        state.collaborators = action.payload.collaborators || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(getAllCollaborators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get collaborator by ID
    builder
      .addCase(getCollaboratorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCollaboratorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCollaborator = action.payload;
      })
      .addCase(getCollaboratorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get my collaborators
    builder
      .addCase(getMyCollaborators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCollaborators.fulfilled, (state, action) => {
        state.loading = false;
        state.collaborators = action.payload;
      })
      .addCase(getMyCollaborators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create collaborator
    builder
      .addCase(createCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        state.collaborators.unshift(action.payload);
      })
      .addCase(createCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update collaborator
    builder
      .addCase(updateCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.collaborators.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.collaborators[index] = action.payload;
        }
        if (state.currentCollaborator?.id === action.payload.id) {
          state.currentCollaborator = action.payload;
        }
      })
      .addCase(updateCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete collaborator
    builder
      .addCase(deleteCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollaborator.fulfilled, (state, action) => {
        state.loading = false;
        state.collaborators = state.collaborators.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Link to publication
    builder
      .addCase(linkCollaboratorToPublication.pending, (state) => {
        state.loading = true;
      })
      .addCase(linkCollaboratorToPublication.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(linkCollaboratorToPublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Unlink from publication
    builder
      .addCase(unlinkCollaboratorFromPublication.pending, (state) => {
        state.loading = true;
      })
      .addCase(unlinkCollaboratorFromPublication.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(unlinkCollaboratorFromPublication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCollaborator, clearError } = collaboratorsSlice.actions;
export default collaboratorsSlice.reducer;
