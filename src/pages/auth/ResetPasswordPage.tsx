import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout } from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { FaLock, FaKey, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errors = {
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Validation mot de passe
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une minuscule';
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une majuscule';
      isValid = false;
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins un chiffre';
      isValid = false;
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formErrors[e.target.name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token de réinitialisation invalide ou manquant');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Le lien a peut-être expiré.');
    } finally {
      setLoading(false);
    }
  };

  // Si pas de token, afficher un message d'erreur
  if (!token) {
    return (
      <AuthLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4 text-red-500">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lien invalide</h2>
          <p className="text-sm text-gray-600 mb-4">Le lien a expiré ou est invalide</p>
          <Link to="/auth/forgot-password">
            <Button variant="gradient" size="md" fullWidth icon={<FaKey />}>
              Demander un nouveau lien
            </Button>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl mb-3 shadow-lg"
              >
                <FaKey className="text-2xl text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Nouveau mot de passe
              </h2>
              <p className="text-sm text-gray-500">
                Choisissez un mot de passe sécurisé
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Alert variant="error">{error}</Alert>
                </motion.div>
              )}

              {/* Password requirements */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  📝 Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
                </p>
              </div>

              <Input
                label="Nouveau mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                icon={<FaLock />}
                placeholder="••••••••"
                error={formErrors.password}
              />

              <Input
                label="Confirmer le mot de passe"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                icon={<FaLock />}
                placeholder="••••••••"
                error={formErrors.confirmPassword}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<FaKey />}
                >
                  {loading ? 'Réinitialisation...' : 'Réinitialiser'}
                </Button>
              </motion.div>

              <p className="text-center text-sm text-gray-600">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FaArrowLeft className="text-xs" />
                  Retour à la connexion
                </Link>
              </p>
            </form>
          </>
        ) : (
          <>
            {/* Success message */}
            <div className="text-center mb-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl mb-3 shadow-lg"
              >
                <FaCheckCircle className="text-2xl text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Mot de passe modifié!
              </h2>
              <p className="text-sm text-gray-500">
                Votre mot de passe a été réinitialisé avec succès
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  ✅ Vous pouvez maintenant vous connecter
                </p>
              </div>

              <Link to="/auth/login">
                <Button
                  variant="gradient"
                  size="md"
                  fullWidth
                  icon={<FaArrowLeft />}
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </AuthLayout>
  );
};
