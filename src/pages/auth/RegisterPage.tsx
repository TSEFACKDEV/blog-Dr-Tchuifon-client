import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout } from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import type { RootState } from '../../store';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaArrowLeft } from 'react-icons/fa';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Validation prénom
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
      isValid = false;
    }

    // Validation nom
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
      isValid = false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email invalide';
      isValid = false;
    }

    // Validation mot de passe
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
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
    
    if (!validateForm()) {
      return;
    }

    try {
      // Simulation d'enregistrement
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Rediriger vers login
      navigate('/auth/login', { 
        state: { message: 'Inscription réussie! Vous pouvez maintenant vous connecter.' }
      });
    } catch (err) {
      // Error already handled by toast
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl mb-3 shadow-lg"
          >
            <FaUserPlus className="text-2xl text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Créer un compte
          </h2>
          <p className="text-sm text-gray-500">
            Rejoignez notre communauté académique
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Alert variant="error">{error}</Alert>
            </motion.div>
          )}

          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prénom"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              icon={<FaUser />}
              placeholder="John"
              error={formErrors.firstName}
            />
            <Input
              label="Nom"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              icon={<FaUser />}
              placeholder="Doe"
              error={formErrors.lastName}
            />
          </div>

          {/* Email */}
          <Input
            label="Adresse email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={<FaEnvelope />}
            placeholder="votre@email.com"
            error={formErrors.email}
          />

          {/* Mot de passe */}
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<FaLock />}
            placeholder="••••••••"
            error={formErrors.password}
            helpText="Au moins 8 caractères"
          />

          {/* Confirmation mot de passe */}
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

          {/* Terms */}
          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              required
              className="w-4 h-4 text-primary-600 border-gray-300 rounded mt-1 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
            <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900">
              J'accepte les{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                politique de confidentialité
              </a>
            </span>
          </label>

          {/* Submit Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
              icon={<FaUserPlus />}
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
          </motion.div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};
