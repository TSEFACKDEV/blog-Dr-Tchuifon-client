import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import type { AppDispatch } from '../../store';
import { createCourse, updateCourse } from '../../store/cours/actions';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Spinner from '../ui/Spinner';
import { FaBook, FaHashtag, FaClock } from 'react-icons/fa';
import type { Course, CourseLevel } from '../../types';

// Schéma de validation - SYNC AVEC BACKEND
const courseValidationSchema = yup.object().shape({
  title: yup.string().optional().nullable().min(5, 'Le titre doit avoir au moins 5 caractères'),
  code: yup.string().optional().nullable(),
  level: yup.string().oneOf(['LICENCE', 'MASTER', 'INGENIEUR', 'DOCTORAT']).optional().nullable(),
  description: yup.string().optional().nullable().min(10, 'La description doit avoir au moins 10 caractères'),
  credits: yup.number().optional().nullable().positive('Les crédits doivent être positifs'),
  hours: yup.number().optional().nullable().positive('Les heures doivent être positives'),
  semester: yup.string().optional().nullable(),
  syllabus: yup.string().optional().nullable().min(10, 'Le syllabus doit avoir au moins 10 caractères'),
  objectives: yup.array().of(yup.string()).optional().nullable(),
  isActive: yup.boolean().optional(),
});

interface CourseFormProps {
  course?: Course;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CourseForm: React.FC<CourseFormProps> = ({ course, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: course?.title || '',
    code: course?.code || '',
    level: course?.level || 'LICENCE' as CourseLevel,
    description: course?.description || '',
    credits: course?.credits || 0,
    hours: course?.hours || 0,
    semester: course?.semester || '',
    syllabus: course?.syllabus || '',
    objectives: course?.objectives.join('\n') || '',
    isActive: course?.isActive ?? true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      // Valider avant d'envoyer
      const data: any = {
        ...formData,
        objectives: formData.objectives.split('\n').map((o: string) => o.trim()).filter(Boolean),
        credits: formData.credits ? parseInt(formData.credits.toString()) : undefined,
        hours: formData.hours ? parseInt(formData.hours.toString()) : undefined,
      };

      // Validation Yup
      await courseValidationSchema.validate(data, { abortEarly: false });

      if (course) {
        await dispatch(updateCourse({ id: course.id, data }));
      } else {
        await dispatch(createCourse(data));
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

      {/* Titre */}
      <div>
        <Input
          label="Titre du cours"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          icon={<FaBook />}
          placeholder="Ex: Intelligence Artificielle et Machine Learning"
          error={validationErrors.title}
        />
      </div>

      {/* Code et Niveau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Code du cours"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          icon={<FaHashtag />}
          placeholder="Ex: INFO-501"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
          <Select
            value={formData.level}
            onChange={(e) => handleChange('level', e.target.value)}
            options={[
              { value: 'LICENCE', label: 'Licence' },
              { value: 'MASTER', label: 'Master' },
              { value: 'INGENIEUR', label: 'Ingénieur' },
              { value: 'DOCTORAT', label: 'Doctorat' },
            ]}
          />
          {validationErrors.level && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.level}</p>
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
            validationErrors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Description détaillée du cours..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-xs">{formData.description.length}/10 caractères</p>
          {validationErrors.description && (
            <p className="text-red-600 text-xs">{validationErrors.description}</p>
          )}
        </div>
      </div>

      {/* Crédits, Heures, Semestre */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Crédits ECTS"
          type="number"
          value={formData.credits}
          onChange={(e) => handleChange('credits', e.target.value)}
          min={0}
          placeholder="6"
        />
        <Input
          label="Heures"
          type="number"
          value={formData.hours}
          onChange={(e) => handleChange('hours', e.target.value)}
          icon={<FaClock />}
          min={0}
          placeholder="48"
        />
        <Input
          label="Semestre"
          value={formData.semester}
          onChange={(e) => handleChange('semester', e.target.value)}
          placeholder="S5, S6, ..."
        />
      </div>

      {/* Syllabus */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu du cours (Syllabus) <span className="text-xs text-gray-500">(min. 20 caractères)</span>
        </label>
        <textarea
          value={formData.syllabus}
          onChange={(e) => handleChange('syllabus', e.target.value)}
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.syllabus ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
          }`}
          placeholder="Chapitres et contenus détaillés..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-xs">{formData.syllabus.length}/20 caractères</p>
          {validationErrors.syllabus && (
            <p className="text-red-600 text-xs">{validationErrors.syllabus}</p>
          )}
        </div>
      </div>

      {/* Objectifs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Objectifs d'apprentissage <span className="text-xs text-gray-500">(un par ligne)</span>
        </label>
        <textarea
          value={formData.objectives}
          onChange={(e) => handleChange('objectives', e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Objectif 1&#10;Objectif 2&#10;Objectif 3..."
        />
      </div>

      {/* Statut actif */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange('isActive', e.target.checked)}
          className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Cours actif (actuellement enseigné)
        </label>
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
          variant="success"
          disabled={loading}
          fullWidth
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? <Spinner size="sm" /> : (course ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
