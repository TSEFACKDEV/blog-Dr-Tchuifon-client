import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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

export const SupervisionForm: React.FC<SupervisionFormProps> = ({ supervision, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [thesisFile, setThesisFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    studentName: supervision?.studentName || '',
    level: supervision?.level || 'MASTER_2' as SupervisionLevel,
    topic: supervision?.topic || '',
    description: supervision?.description || '',
    startDate: supervision?.startDate.split('T')[0] || new Date().toISOString().split('T')[0],
    endDate: supervision?.endDate?.split('T')[0] || '',
    status: supervision?.status || 'IN_PROGRESS' as SupervisionStatus,
    publications: supervision?.publications.join('\n') || '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThesisFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = {
        ...formData,
        publications: formData.publications.split('\n').map((p: string) => p.trim()).filter(Boolean),
        endDate: formData.endDate || undefined,
      };

      if (thesisFile) {
        data.thesis = thesisFile;
      }

      if (supervision) {
        await dispatch(updateSupervision({ id: supervision.id, data }));
      } else {
        await dispatch(createSupervision(data));
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
      {/* Nom de l'étudiant */}
      <div>
        <Input
          label="Nom de l'étudiant *"
          value={formData.studentName}
          onChange={(e) => handleChange('studentName', e.target.value)}
          icon={<FaUser />}
          required
          placeholder="Prénom Nom"
        />
      </div>

      {/* Niveau et Statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau *</label>
          <Select
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value)}
            required
            options={[
              { value: 'INGENIEUR', label: 'Ingénieur' },
              { value: 'MASTER_2', label: 'Master 2' },
              { value: 'DOCTORAT', label: 'Doctorat' },
              { value: 'POST_DOC', label: 'Post-Doctorat' },
            ]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
          <Select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            required
            options={[
              { value: 'IN_PROGRESS', label: 'En cours' },
              { value: 'COMPLETED', label: 'Terminé' },
              { value: 'ABANDONED', label: 'Abandonné' },
            ]}
          />
        </div>
      </div>

      {/* Sujet */}
      <div>
        <Input
          label="Sujet de recherche *"
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          icon={<FaBook />}
          required
          placeholder="Titre du sujet de thèse/mémoire"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Description détaillée du projet de recherche..."
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date de début *"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          icon={<FaCalendar />}
          required
        />
        <Input
          label="Date de fin"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          icon={<FaCalendar />}
        />
      </div>

      {/* Publications associées */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publications associées <span className="text-xs text-gray-500">(une par ligne)</span>
        </label>
        <textarea
          value={formData.publications}
          onChange={(e) => handleChange('publications', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Titre de publication 1&#10;Titre de publication 2&#10;..."
        />
      </div>

      {/* Fichier thèse/mémoire */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier thèse/mémoire <FaFile className="inline ml-1" />
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
        {supervision?.thesisUrl && (
          <p className="text-xs text-gray-500 mt-1">Fichier actuel: {supervision.thesisUrl}</p>
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
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          {loading ? <Spinner size="sm" /> : (supervision ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
