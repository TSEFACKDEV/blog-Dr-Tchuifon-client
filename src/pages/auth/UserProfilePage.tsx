import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { MainLayout } from '../../layouts/MainLayout';
import Card from "../../components/ui/Card";
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { getImageUrl, getInitials } from '../../utils/helpers';

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.profile?.fullName || '',
    email: user?.email || '',
  });

  // URL de la photo actuelle depuis le serveur
  const currentPhotoUrl = getImageUrl(user?.profile?.photoUrl);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, photo: 'La photo ne doit pas dépasser 5 MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfileForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Le nom complet est requis';
    }
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Le mot de passe doit contenir majuscules, minuscules et chiffres';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setFormErrors({ submit: 'Erreur lors de la mise à jour du profil' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setFormErrors({ submit: 'Erreur lors du changement de mot de passe' });
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Mon Profil
            </h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles et paramètres de sécurité
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 animate-slide-up">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-xl" />
                <p className="text-green-800 font-medium">
                  Modifications enregistrées avec succès!
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar - Photo Profile */}
            <div className="md:col-span-1">
              <Card className="animate-scale-in animation-delay-100">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : currentPhotoUrl ? (
                        <img src={currentPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(formData.fullName || 'User')
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <FaCamera />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  {formErrors.photo && (
                    <p className="text-sm text-red-600">{formErrors.photo}</p>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium">
                      {user.role}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-4 animate-scale-in animation-delay-200">
                <div className="space-y-2">
                  {!isEditing && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <FaUser className="mr-2" />
                      Modifier le profil
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="border-2 border-gray-300 hover:border-gray-400"
                  >
                    <FaLock className="mr-2" />
                    {showPasswordForm ? 'Annuler' : 'Changer le mot de passe'}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Information Form */}
              <Card className="animate-slide-up animation-delay-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaUser className="text-blue-600" />
                  Informations personnelles
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <Input
                    label="Nom complet"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={formErrors.fullName}
                    icon={<FaUser />}
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={formErrors.email}
                    icon={<FaEnvelope />}
                  />

                  {formErrors.submit && (
                    <p className="text-sm text-red-600">{formErrors.submit}</p>
                  )}

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <FaSave className="mr-2" />
                        Enregistrer
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400"
                      >
                        <FaTimes className="mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </form>
              </Card>

              {/* Password Change Form */}
              {showPasswordForm && (
                <Card className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FaLock className="text-purple-600" />
                    Changer le mot de passe
                  </h2>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <Input
                      label="Mot de passe actuel"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      error={formErrors.currentPassword}
                      icon={<FaLock />}
                    />

                    <Input
                      label="Nouveau mot de passe"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      error={formErrors.newPassword}
                      icon={<FaLock />}
                    />

                    <Input
                      label="Confirmer le mot de passe"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      error={formErrors.confirmPassword}
                      icon={<FaLock />}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                      <strong className="block mb-2">Exigences du mot de passe:</strong>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Au moins 8 caractères</li>
                        <li>Au moins une majuscule</li>
                        <li>Au moins une minuscule</li>
                        <li>Au moins un chiffre</li>
                      </ul>
                    </div>

                    {formErrors.submit && (
                      <p className="text-sm text-red-600">{formErrors.submit}</p>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <FaSave className="mr-2" />
                        Modifier le mot de passe
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setFormErrors({});
                        }}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400"
                      >
                        <FaTimes className="mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* Account Info */}
              <Card className="animate-fade-in animation-delay-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Informations du compte
                </h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Membre depuis</p>
                    <p className="font-semibold">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dernière connexion</p>
                    <p className="font-semibold">{new Date().toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
