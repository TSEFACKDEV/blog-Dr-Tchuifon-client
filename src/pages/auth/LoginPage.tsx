import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout } from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import type { AppDispatch, RootState } from '../../store';
import { login } from '../../store/auth/actions';
import { FaEnvelope, FaLock, FaUserShield, FaArrowRight } from 'react-icons/fa';

export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(formData));
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-3 shadow-lg"
          >
            <FaUserShield className="text-2xl text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Connexion Admin
          </h2>
          <p className="text-sm text-gray-500">
            Accédez au panneau d'administration
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
          />

          {/* Password */}
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<FaLock />}
            placeholder="••••••••"
          />

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                Se souvenir de moi
              </span>
            </label>

            <Link
              to="/auth/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Mot de passe oublié?
            </Link>
          </div>

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
              icon={<FaArrowRight />}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </motion.div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            Pasde compte?{' '}
            <Link
              to="/auth/register"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};
