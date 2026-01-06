import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { createCollaborator, updateCollaborator } from '../../store/collaborators/actions';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { FaUser, FaUniversity, FaGlobe, FaEnvelope, FaCamera } from 'react-icons/fa';
import { SiGooglescholar, SiOrcid } from 'react-icons/si';
import type { Collaborator } from '../../types';

interface CollaboratorFormProps {
  collaborator?: Collaborator;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CollaboratorForm: React.FC<CollaboratorFormProps> = ({ collaborator, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: collaborator?.name || '',
    title: collaborator?.title || '',
    institution: collaborator?.institution || '',
    department: collaborator?.department || '',
    country: collaborator?.country || '',
    email: collaborator?.email || '',
    website: collaborator?.website || '',
    researchArea: collaborator?.researchArea || '',
    googleScholar: collaborator?.googleScholar || '',
    orcid: collaborator?.orcid || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = { ...formData };
      
      if (photoFile) {
        data.photo = photoFile;
      }

      if (collaborator) {
        await dispatch(updateCollaborator({ id: collaborator.id, data }));
      } else {
        await dispatch(createCollaborator(data));
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      // Error already handled by toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo <FaCamera className="inline ml-1" />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        {collaborator?.photoUrl && (
          <p className="text-xs text-gray-500 mt-1">Photo actuelle disponible</p>
        )}
      </div>

      {/* Nom */}
      <div>
        <Input
          label="Nom complet *"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          icon={<FaUser />}
          required
          placeholder="Dr. John Doe"
        />
      </div>

      {/* Titre */}
      <div>
        <Input
          label="Titre/Position"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Professeur, Chercheur, ..."
        />
      </div>

      {/* Institution et Département */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Institution *"
          value={formData.institution}
          onChange={(e) => handleChange('institution', e.target.value)}
          icon={<FaUniversity />}
          required
          placeholder="Université, Laboratoire..."
        />
        <Input
          label="Département"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder="Département..."
        />
      </div>

      {/* Pays */}
      <div>
        <Input
          label="Pays"
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          placeholder="France, Cameroun, ..."
        />
      </div>

      {/* Email et Site web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          icon={<FaEnvelope />}
          placeholder="email@example.com"
        />
        <Input
          label="Site Web"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          icon={<FaGlobe />}
          placeholder="https://..."
        />
      </div>

      {/* Domaine de recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Domaine de recherche</label>
        <textarea
          value={formData.researchArea}
          onChange={(e) => handleChange('researchArea', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Intelligence Artificielle, Machine Learning, ..."
        />
      </div>

      {/* Google Scholar et ORCID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <SiGooglescholar /> Google Scholar
          </label>
          <Input
            value={formData.googleScholar}
            onChange={(e) => handleChange('googleScholar', e.target.value)}
            placeholder="https://scholar.google.com/..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <SiOrcid /> ORCID
          </label>
          <Input
            value={formData.orcid}
            onChange={(e) => handleChange('orcid', e.target.value)}
            placeholder="0000-0000-0000-0000"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
          fullWidth
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          fullWidth
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? <Spinner size="sm" /> : (collaborator ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
