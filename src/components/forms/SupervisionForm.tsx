import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import type { AppDispatch } from '../../store';
import { createSupervision, updateSupervision } from '../../store/supervisions/actions';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Spinner from '../ui/Spinner';
import { FaUser, FaCalendar, FaBook, FaFile } from 'react-icons/fa';
import type { Supervision, SupervisionLevel, SupervisionStatus } from '../../types';

interface SupervisionFormProps {
  supervision?: Supervision;
  onClose: () => void;
  onSuccess?: () => void;
}

// Schéma de validation - SYNC AVEC BACKEND
const supervisionValidationSchema = yup.object().shape({
  studentName: yup.string().optional().nullable().min(5, 'Le nom doit avoir au moins 5 caractères'),
  level: yup.string().oneOf(['INGENIEUR', 'MASTER_2', 'DOCTORAT', 'POST_DOC']).optional().nullable(),
  topic: yup.string().optional().nullable().min(10, 'Le sujet doit avoir au moins 10 caractères'),
  description: yup.string().optional().nullable().min(10, 'La description doit avoir au moins 10 caractères'),
  startDate: yup.string().optional().nullable(),
  endDate: yup.string().optional().nullable(),
  status: yup.string().oneOf(['IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional().nullable(),
  publications: yup.array().of(yup.string()).optional().nullable(),
});

export const SupervisionForm: React.FC<SupervisionFormProps> = ({ supervision, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [thesisFile, setThesisFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    studentName: supervision?.studentName || '',
    level: supervision?.level || 'MASTER_2' as SupervisionLevel,
    topic: supervision?.topic || '',
    description: supervision?.description || '',
    startDate: supervision?.startDate?.split('T')[0] || '',  // ← VIDE PAR DÉFAUT
    endDate: supervision?.endDate?.split('T')[0] || '',
    status: supervision?.status || 'IN_PROGRESS' as SupervisionStatus,
    publications: supervision?.publications.join('\n') || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThesisFile(e.target.files[0]);
    }
  };

  const handleSetStartDateUnknown = () => {
    handleChange('startDate', 'unknown');
  };

  const handleSetEndDateUnknown = () => {
    handleChange('endDate', 'unknown');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const data: any = {
        ...formData,
        publications: formData.publications.split('\n').map((p: string) => p.trim()).filter(Boolean),
        endDate: formData.endDate || undefined,
      };

      if (thesisFile) {
        data.thesis = thesisFile;
      }

      // Validation Yup
      await supervisionValidationSchema.validate(data, { abortEarly: false });

      if (supervision) {
        await dispatch(updateSupervision({ id: supervision.id, data }));
      } else {
        await dispatch(createSupervision(data));
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

      {/* Nom de l'étudiant */}
      <div>
        <Input
          label="Nom de l'étudiant"
          value={formData.studentName}
          onChange={(e) => handleChange('studentName', e.target.value)}
          icon={<FaUser />}
          placeholder="Prénom Nom"
          error={validationErrors.studentName}
        />
        {formData.studentName && (
          <p className="text-gray-600 text-xs mt-1">{formData.studentName.length}/5 caractères minimum</p>
        )}
      </div>

      {/* Niveau et Statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
          <Select
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value)}
            options={[
              { value: 'INGENIEUR', label: 'Ingénieur' },
              { value: 'MASTER_2', label: 'Master 2' },
              { value: 'DOCTORAT', label: 'Doctorat' },
              { value: 'POST_DOC', label: 'Post-Doctorat' },
            ]}
          />
          {validationErrors.level && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.level}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <Select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'IN_PROGRESS', label: 'En cours' },
              { value: 'COMPLETED', label: 'Terminé' },
              { value: 'ABANDONED', label: 'Abandonné' },
            ]}
          />
          {validationErrors.status && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.status}</p>
          )}
        </div>
      </div>

      {/* Sujet */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sujet de recherche <span className="text-xs text-gray-500">(min. 10 caractères)</span>
        </label>
        <textarea
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.topic ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
          }`}
          placeholder="Sujet ou titre de la recherche..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-xs">{formData.topic.length}/10 caractères</p>
          {validationErrors.topic && (
            <p className="text-red-600 text-xs">{validationErrors.topic}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-xs text-gray-500">(min. 10 caractères)</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
          }`}
          placeholder="Description détaillée..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-xs">{formData.description.length}/10 caractères</p>
          {validationErrors.description && (
            <p className="text-red-600 text-xs">{validationErrors.description}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              icon={<FaCalendar />}
              placeholder="YYYY-MM-DD"
              error={validationErrors.startDate}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSetStartDateUnknown}
            >
              Inconnue
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              icon={<FaCalendar />}
              placeholder="YYYY-MM-DD"
              error={validationErrors.endDate}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSetEndDateUnknown}
            >
              Inconnue
            </Button>
          </div>
        </div>
      </div>

      {/* Thèse PDF */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier thèse/mémoire
        </label>
        <input
          type="file"
          accept="application/pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Publications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publications associées <span className="text-xs text-gray-500">(une par ligne)</span>
        </label>
        <textarea
          value={formData.publications}
          onChange={(e) => handleChange('publications', e.target.value)}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.publications ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-yellow-500'
          }`}
          placeholder="Titre publication 1&#10;Titre publication 2..."
        />
        {validationErrors.publications && (
          <p className="text-red-600 text-xs mt-1">{validationErrors.publications}</p>
        )}
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
          variant="warning"
          disabled={loading}
          fullWidth
        >
          {loading ? <Spinner size="sm" /> : (supervision ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
