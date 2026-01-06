import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import profileReducer from './profile/slice';
import publicationsReducer from './publications/slice';
import coursesReducer from './cours/slice';
import supervisionsReducer from './supervisions/slice';
import collaboratorsReducer from './collaborators/slice';
import contactReducer from './contact/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    publications: publicationsReducer,
    courses: coursesReducer,
    supervisions: supervisionsReducer,
    collaborators: collaboratorsReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les actions avec File objects
        ignoredActions: [
          'profile/create/pending',
          'profile/update/pending',
          'publications/create/pending',
          'publications/update/pending',
          'collaborators/create/pending',
          'collaborators/update/pending',
        ],
        ignoredActionPaths: ['payload.photo', 'payload.cv', 'payload.pdf'],
        ignoredPaths: ['profile.photo', 'profile.cv', 'publications.pdf', 'collaborators.photo'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
