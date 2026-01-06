import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant ou invalide');
        return;
      }

      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simuler succès
        setStatus('success');
        setMessage('Votre email a été vérifié avec succès!');
        
        // Rediriger après 3 secondes
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { message: 'Email vérifié! Vous pouvez maintenant vous connecter.' }
          });
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage('La vérification a échoué. Le lien a peut-être expiré.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          {status === 'loading' && (
            <>
              {/* Loading */}
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl">
                  <FaSpinner className="text-4xl text-white animate-spin" />
                </div>
                <h2 className="text-4xl font-bold gradient-text mb-2">
                  Vérification en cours
                </h2>
                <p className="text-gray-600">
                  Veuillez patienter pendant que nous vérifions votre email...
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in animation-delay-200">
                <div className="flex items-center justify-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              {/* Success */}
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 animate-bounce-in shadow-2xl">
                  <FaCheckCircle className="text-4xl text-white" />
                </div>
                <h2 className="text-4xl font-bold gradient-text mb-2">
                  Email vérifié!
                </h2>
                <p className="text-gray-600">
                  {message}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up animation-delay-100">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200 animate-fade-in animation-delay-200">
                    <p className="text-sm text-green-800">
                      <strong className="block mb-2">✅ Compte activé</strong>
                      Votre compte a été activé avec succès. Vous allez être redirigé vers la page de connexion...
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 animate-fade-in animation-delay-300">
                    <FaSpinner className="animate-spin" />
                    <span>Redirection automatique dans 3 secondes</span>
                  </div>

                  <div className="pt-2 animate-scale-in animation-delay-400">
                    <Link to="/auth/login">
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        Se connecter maintenant
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              {/* Error */}
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4 animate-bounce-in shadow-2xl">
                  <FaTimesCircle className="text-4xl text-white" />
                </div>
                <h2 className="text-4xl font-bold gradient-text mb-2">
                  Erreur de vérification
                </h2>
                <p className="text-gray-600">
                  {message}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up animation-delay-100">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 animate-fade-in animation-delay-200">
                    <p className="text-sm text-red-800">
                      <strong className="block mb-2">❌ Vérification échouée</strong>
                      Le lien de vérification est invalide ou a expiré. Veuillez contacter le support ou créer un nouveau compte.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 animate-scale-in animation-delay-300">
                    <Link to="/auth/register">
                      <Button
                        variant="secondary"
                        size="lg"
                        fullWidth
                        className="border-2 border-gray-300 hover:border-gray-400"
                      >
                        Nouveau compte
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Support
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 animate-fade-in animation-delay-500">
            <p>
              © {new Date().getFullYear()} Dr. Tchuifon - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
