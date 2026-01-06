import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthLayout } from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import type { AppDispatch, RootState } from '../../store';
import { forgotPassword } from '../../store/auth/actions';
import { FaEnvelope, FaKey, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export const ForgotPasswordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword({ email }));
    if (forgotPassword.fulfilled.match(result)) {
      setSuccess(true);
    }
  };

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
                Mot de passe oublié?
              </h2>
              <p className="text-sm text-gray-500">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Alert variant="error">{error}</Alert>
                </motion.div>
              )}

              <Input
                label="Adresse email"
                type="email"
                name="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                icon={<FaEnvelope />}
                placeholder="votre@email.com"
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
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
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
                Email envoyé!
              </h2>
              <p className="text-sm text-gray-500">
                Vérifiez votre boîte mail
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  📧 Un lien a été envoyé à <strong className="font-mono">{email}</strong>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setSuccess(false)}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Renvoyer l'email
                </Button>
                
                <Link to="/auth/login">
                  <Button
                    variant="gradient"
                    size="md"
                    fullWidth
                    icon={<FaArrowLeft />}
                  >
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AuthLayout>
  );
};
