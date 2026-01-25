import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
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

// Schéma de validation - SYNC AVEC BACKEND
const collaboratorValidationSchema = yup.object().shape({
  name: yup.string().optional().nullable().min(5, 'Le nom doit avoir au moins 5 caractères'),
  title: yup.string().optional().nullable(),
  institution: yup.string().optional().nullable().min(5, 'L\'institution doit avoir au moins 5 caractères'),
  department: yup.string().optional().nullable(),
  country: yup.string().optional().nullable(),
  email: yup.string().optional().nullable().email('Email invalide'),
  website: yup.string().optional().nullable().url('L\'URL doit être valide'),
  researchArea: yup.string().optional().nullable(),
  googleScholar: yup.string().optional().nullable().url('L\'URL doit être valide'),
  orcid: yup.string().optional().nullable(),
});

export const CollaboratorForm: React.FC<CollaboratorFormProps> = ({ collaborator, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
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
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const data: any = { ...formData };
      
      if (photoFile) {
        data.photo = photoFile;
      }

      // Validation Yup
      await collaboratorValidationSchema.validate(data, { abortEarly: false });

      if (collaborator) {
        await dispatch(updateCollaborator({ id: collaborator.id, data }));
      } else {
        await dispatch(createCollaborator(data));
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        // Afficher les erreurs de validation
        const errors = error.inner.reduce((acc, err) => ({
          ...acc,
          [err.path || 'general']: err.message,
        }), {});
        setValidationErrors(errors);
      }
      // Les erreurs API sont déjà gérées par toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Erreurs globales */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium text-sm mb-2">Erreurs de validation:</p>
          <ul className="text-red-700 text-sm space-y-1">
            {Object.entries(validationErrors)
              .filter(([_, msg]) => msg)
              .map(([field, msg]) => (
                <li key={field}>• {msg}</li>
              ))}
          </ul>
        </div>
      )}

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
          label="Nom complet"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          icon={<FaUser />}
          placeholder="Dr. John Doe"
          error={validationErrors.name}
        />
        {formData.name && (
          <p className="text-gray-600 text-xs mt-1">{formData.name.length}/2 caractères minimum</p>
        )}
      </div>

      {/* Titre et Institution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Titre / Fonction"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Ex: Professeur, Doctorant, ..."
          error={validationErrors.title}
        />
        <div>
          <Input
            label="Institution"
            value={formData.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            icon={<FaUniversity />}
            placeholder="Ex: Université Paris 1"
            error={validationErrors.institution}
          />
          {formData.institution && (
            <p className="text-gray-600 text-xs mt-1">{formData.institution.length}/2 caractères minimum</p>
          )}
        </div>
      </div>

      {/* Département et Pays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Département"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          placeholder="Ex: Informatique"
          error={validationErrors.department}
        />
        <Input
          label="Pays"
          value={formData.country}
          onChange={(e) => handleChange('country', e.target.value)}
          placeholder="Ex: France"
          error={validationErrors.country}
        />
      </div>

      {/* Email et Site Web */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          icon={<FaEnvelope />}
          placeholder="email@example.com"
          error={validationErrors.email}
        />
        <Input
          label="Site web personnel"
          type="url"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          icon={<FaGlobe />}
          placeholder="https://example.com"
          error={validationErrors.website}
        />
      </div>

      {/* Domaine de recherche */}
      <div>
        <Input
          label="Domaine de recherche"
          value={formData.researchArea}
          onChange={(e) => handleChange('researchArea', e.target.value)}
          placeholder="Ex: Machine Learning, Bioinformatique, ..."
          error={validationErrors.researchArea}
        />
      </div>

      {/* Google Scholar, ORCID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Google Scholar"
          type="url"
          value={formData.googleScholar}
          onChange={(e) => handleChange('googleScholar', e.target.value)}
          icon={<SiGooglescholar />}
          placeholder="https://scholar.google.com/..."
          error={validationErrors.googleScholar}
        />
        <Input
          label="ORCID"
          value={formData.orcid}
          onChange={(e) => handleChange('orcid', e.target.value)}
          icon={<SiOrcid />}
          placeholder="Ex: 0000-0000-0000-0000"
          error={validationErrors.orcid}
        />
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
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? <Spinner size="sm" /> : (collaborator ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
