import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { getMyProfile, updateProfile } from '../../store/profile/actions';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FaUser, FaEnvelope, FaPhone, FaUniversity, FaCamera, FaSave, FaEdit, FaLinkedin, FaGlobe, FaGraduationCap } from 'react-icons/fa';
import { SiGooglescholar, SiResearchgate, SiOrcid } from 'react-icons/si';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Spinner from '../../components/ui/Spinner';
import { API_BASE_URL } from '../../config/api.config';

export const ProfileManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    institution: '',
    department: '',
    email: '',
    phone: '',
    officeLocation: '',
    specializations: [] as string[],
    degrees: [] as string[],
    googleScholar: '',
    researchGate: '',
    orcid: '',
    linkedin: '',
    website: '',
  });

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        title: profile.title || '',
        bio: profile.bio || '',
        institution: profile.institution || '',
        department: profile.department || '',
        email: profile.email || '',
        phone: profile.phone || '',
        officeLocation: profile.officeLocation || '',
        specializations: profile.specializations || [],
        degrees: profile.degrees || [],
        googleScholar: profile.googleScholar || '',
        researchGate: profile.researchGate || '',
        orcid: profile.orcid || '',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
      });
      if (profile.photoUrl) {
        setPhotoPreview(`${API_BASE_URL}${profile.photoUrl}`);
      }
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPhotoFile(null);
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        title: profile.title || '',
        bio: profile.bio || '',
        institution: profile.institution || '',
        department: profile.department || '',
        email: profile.email || '',
        phone: profile.phone || '',
        officeLocation: profile.officeLocation || '',
        specializations: profile.specializations || [],
        degrees: profile.degrees || [],
        googleScholar: profile.googleScholar || '',
        researchGate: profile.researchGate || '',
        orcid: profile.orcid || '',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
      });
      if (profile.photoUrl) {
        setPhotoPreview(`${API_BASE_URL}${profile.photoUrl}`);
      }
    }
  };

  const handleSave = async () => {
    const updateData: any = { ...formData };
    if (photoFile) {
      updateData.photo = photoFile;
    }
    await dispatch(updateProfile(updateData));
    setIsEditing(false);
    setPhotoFile(null);
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading && !profile) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Gestion du Profil
            </h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>

          {error && (
            <div className="mb-6 animate-slide-down">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Profile Card */}
            <div className="lg:col-span-1 animate-scale-in">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="relative inline-block mb-6 group">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl mx-auto">
                    <img
                      src={photoPreview || '/uploads/profiles/default.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg group-hover:scale-110">
                      <FaCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.fullName || user?.email}
                </h2>
                <p className="text-gray-600 mb-4">{formData.title}</p>
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2 justify-center">
                    <FaEnvelope className="text-blue-500" />
                    <span className="truncate">{formData.email || user?.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center gap-2 justify-center">
                      <FaPhone className="text-green-500" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                  {formData.institution && (
                    <div className="flex items-center gap-2 justify-center">
                      <FaUniversity className="text-purple-500" />
                      <span className="text-center">{formData.institution}</span>
                    </div>
                  )}
                </div>

                {/* Links sociaux */}
                {!isEditing && (
                  <div className="mt-6 flex gap-3 justify-center flex-wrap">
                    {formData.googleScholar && (
                      <a href={formData.googleScholar} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <SiGooglescholar size={24} />
                      </a>
                    )}
                    {formData.researchGate && (
                      <a href={formData.researchGate} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                        <SiResearchgate size={24} />
                      </a>
                    )}
                    {formData.orcid && (
                      <a href={`https://orcid.org/${formData.orcid}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                        <SiOrcid size={24} />
                      </a>
                    )}
                    {formData.linkedin && (
                      <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                        <FaLinkedin size={24} />
                      </a>
                    )}
                    {formData.website && (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                        <FaGlobe size={24} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Information Form */}
            <div className="lg:col-span-2 animate-slide-up animation-delay-200">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Informations Personnelles
                  </h3>
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <FaEdit />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancel}
                        variant="secondary"
                        disabled={loading}
                        className="border-2 border-gray-300"
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        {loading ? <Spinner size="sm" /> : <FaSave />}
                        Enregistrer
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {/* Nom complet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom Complet *
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        icon={<FaUser />}
                        required
                      />
                    ) : (
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.fullName || '-'}</p>
                    )}
                  </div>

                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre Professionnel *
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Ex: Professeur en Intelligence Artificielle"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.title || '-'}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biographie *
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Parlez de votre parcours et expertise..."
                        required
                      />
                    ) : (
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">{formData.bio || '-'}</p>
                    )}
                  </div>

                  {/* Institution & Department */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.institution}
                          onChange={(e) => handleChange('institution', e.target.value)}
                          icon={<FaUniversity />}
                        />
                      ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.institution || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Département
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.department}
                          onChange={(e) => handleChange('department', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.department || '-'}</p>
                      )}
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          icon={<FaEnvelope />}
                        />
                      ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.email || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          icon={<FaPhone />}
                        />
                      ) : (
                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.phone || '-'}</p>
                      )}
                    </div>
                  </div>

                  {/* Office Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bureau
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.officeLocation}
                        onChange={(e) => handleChange('officeLocation', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.officeLocation || '-'}</p>
                    )}
                  </div>

                  {/* Links académiques */}
                  <div className="pt-4 border-t">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaGraduationCap className="text-blue-600" />
                      Liens Académiques
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Scholar
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.googleScholar}
                            onChange={(e) => handleChange('googleScholar', e.target.value)}
                            placeholder="https://scholar.google.com/..."
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg truncate">{formData.googleScholar || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ResearchGate
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.researchGate}
                            onChange={(e) => handleChange('researchGate', e.target.value)}
                            placeholder="https://www.researchgate.net/..."
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg truncate">{formData.researchGate || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ORCID
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.orcid}
                            onChange={(e) => handleChange('orcid', e.target.value)}
                            placeholder="0000-0000-0000-0000"
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{formData.orcid || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.linkedin}
                            onChange={(e) => handleChange('linkedin', e.target.value)}
                            placeholder="https://www.linkedin.com/..."
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg truncate">{formData.linkedin || '-'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Web Personnel
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.website}
                            onChange={(e) => handleChange('website', e.target.value)}
                            icon={<FaGlobe />}
                            placeholder="https://..."
                          />
                        ) : (
                          <p className="text-gray-900 p-3 bg-gray-50 rounded-lg truncate">{formData.website || '-'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
