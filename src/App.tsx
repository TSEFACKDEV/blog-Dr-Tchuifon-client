import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { getProfile } from './store/auth/actions';

// Components
import { AdminRoute } from './components/AdminRoute';
import { RoleGuard } from './components/RoleGuard';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PublicationsPage } from './pages/PublicationsPage';
import { CoursesPage } from './pages/CoursesPage';
import { SupervisionsPage } from './pages/SupervisionsPage';
import { CollaboratorsPage } from './pages/CollaboratorsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Public Detail Pages
import CourseDetailsPage from './pages/CourseDetailsPage';
import PublicationDetailsPage from './pages/PublicationDetailsPage';
import CollaboratorDetailsPage from './pages/CollaboratorDetailsPage';
import SupervisionDetailsPage from './pages/SupervisionDetailsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { UserProfilePage } from './pages/auth/UserProfilePage';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { PublicationsManagementPage } from './pages/admin/PublicationsManagementPage';
import { CoursesManagementPage } from './pages/admin/CoursesManagementPage';
import { SupervisionsManagementPage } from './pages/admin/SupervisionsManagementPage';
import { CollaboratorsManagementPage } from './pages/admin/CollaboratorsManagementPage';
import { MessagesManagementPage } from './pages/admin/MessagesManagementPage';
import { ProfileManagementPage } from './pages/admin/ProfileManagementPage';

// Collaborator Pages
import { CollaboratorDashboardPage } from './pages/collaborator/CollaboratorDashboardPage';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Silently check profile without showing error toast on initial load
      dispatch(getProfile()).catch(() => {
        // Ignore errors on initial load
      });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/publications/:slug" element={<PublicationDetailsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/supervisions" element={<SupervisionsPage />} />
        <Route path="/supervisions/:id" element={<SupervisionDetailsPage />} />
        <Route path="/collaborators" element={<CollaboratorsPage />} />
        <Route path="/collaborators/:id" element={<CollaboratorDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        
        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />

        {/* Admin Routes - Publications Management */}
        <Route
          path="/admin/publications"
          element={
            <AdminRoute>
              <PublicationsManagementPage />
            </AdminRoute>
          }
        />

        {/* Admin Routes - Courses Management */}
        <Route
          path="/admin/courses"
          element={
            <AdminRoute>
              <CoursesManagementPage />
            </AdminRoute>
          }
        />

        {/* Admin Routes - Supervisions Management */}
        <Route
          path="/admin/supervisions"
          element={
            <AdminRoute>
              <SupervisionsManagementPage />
            </AdminRoute>
          }
        />

        {/* Admin Routes - Collaborators Management */}
        <Route
          path="/admin/collaborators"
          element={
            <AdminRoute>
              <CollaboratorsManagementPage />
            </AdminRoute>
          }
        />

        {/* Admin Routes - Messages Management */}
        <Route
          path="/admin/messages"
          element={
            <AdminRoute>
              <MessagesManagementPage />
            </AdminRoute>
          }
        />

        {/* Admin Routes - Profile Management */}
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <ProfileManagementPage />
            </AdminRoute>
          }
        />

        {/* Collaborator Routes */}
        <Route
          path="/collaborator/dashboard"
          element={
            <RoleGuard allowedRoles={['COLLABORATOR']}>
              <CollaboratorDashboardPage />
            </RoleGuard>
          }
        />

        {/* Catch-all for other admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl animate-scale-in">
                  <div className="text-6xl mb-4 animate-bounce">🚧</div>
                  <h2 className="text-2xl font-bold gradient-text mb-4">
                    Page en construction
                  </h2>
                  <p className="text-gray-600">
                    Cette page sera bientôt disponible.
                  </p>
                </div>
              </div>
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
