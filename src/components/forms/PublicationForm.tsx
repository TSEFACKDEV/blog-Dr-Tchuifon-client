import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import type { AppDispatch } from '../../store';
import { createPublication, updatePublication } from '../../store/publications/actions';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Spinner from '../ui/Spinner';
import { FaBook, FaCalendar, FaHashtag } from 'react-icons/fa';
import type { Publication, PublicationType } from '../../types';

interface PublicationFormProps {
  publication?: Publication;
  onClose: () => void;
  onSuccess?: () => void;
}

// Schéma de validation - SYNC AVEC BACKEND
const publicationValidationSchema = yup.object().shape({
  title: yup.string().optional().nullable().min(5, 'Le titre doit avoir au moins 5 caractères'),
  abstract: yup.string().optional().nullable().min(10, 'Le résumé doit avoir au moins 10 caractères'),
  authors: yup.array().of(yup.string()).optional().nullable(),
  journal: yup.string().optional().nullable(),
  conference: yup.string().optional().nullable(),
  publicationDate: yup.string().optional().nullable(),
  year: yup.number().optional().nullable().integer().positive(),
  volume: yup.string().optional().nullable(),
  issue: yup.string().optional().nullable(),
  pages: yup.string().optional().nullable(),
  publisher: yup.string().optional().nullable(),
  doi: yup.string().optional().nullable(),
  isbn: yup.string().optional().nullable(),
  issn: yup.string().optional().nullable(),
  type: yup.string().oneOf(['ARTICLE', 'CONFERENCE', 'BOOK_CHAPTER', 'THESIS', 'PATENT', 'POSTER']).optional().nullable(),
  keywords: yup.array().of(yup.string()).optional().nullable(),
  citations: yup.number().optional().nullable().integer().min(0),
  isPublished: yup.boolean().optional(),
});

export const PublicationForm: React.FC<PublicationFormProps> = ({ publication, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: publication?.title || '',
    abstract: publication?.abstract || '',
    authors: publication?.authors.join(', ') || '',
    journal: publication?.journal || '',
    conference: publication?.conference || '',
    publicationDate: publication?.publicationDate?.split('T')[0] || '',  // ← VIDE PAR DÉFAUT
    year: publication?.year || new Date().getFullYear(),
    volume: publication?.volume || '',
    issue: publication?.issue || '',
    pages: publication?.pages || '',
    publisher: publication?.publisher || '',
    doi: publication?.doi || '',
    isbn: publication?.isbn || '',
    issn: publication?.issn || '',
    type: publication?.type || 'ARTICLE' as PublicationType,
    keywords: publication?.keywords.join(', ') || '',
    citations: publication?.citations || 0,
    isPublished: publication?.isPublished ?? true,
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
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSetDateUnknown = () => {
    handleChange('publicationDate', 'unknown');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    try {
      const data: any = {
        ...formData,
        authors: formData.authors.split(',').map((a: string) => a.trim()).filter(Boolean),
        keywords: formData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        year: formData.year ? parseInt(formData.year.toString()) : null,
        citations: formData.citations ? parseInt(formData.citations.toString()) : 0,
      };

      if (pdfFile) {
        data.pdf = pdfFile;
      }

      // Validation Yup
      await publicationValidationSchema.validate(data, { abortEarly: false });

      if (publication) {
        await dispatch(updatePublication({ id: publication.id, data }));
      } else {
        await dispatch(createPublication(data));
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
          label="Titre"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          icon={<FaBook />}
          placeholder="Titre de la publication"
          error={validationErrors.title}
        />
        {formData.title && (
          <p className="text-gray-600 text-xs mt-1">{formData.title.length}/5 caractères minimum</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de publication</label>
        <Select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          options={[
            { value: 'ARTICLE', label: 'Article de journal' },
            { value: 'CONFERENCE', label: 'Conférence' },
            { value: 'BOOK_CHAPTER', label: 'Chapitre de livre' },
            { value: 'THESIS', label: 'Thèse' },
            { value: 'PATENT', label: 'Brevet' },
            { value: 'POSTER', label: 'Poster' },
          ]}
        />
        {validationErrors.type && (
          <p className="text-red-600 text-xs mt-1">{validationErrors.type}</p>
        )}
      </div>

      {/* Auteurs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auteurs <span className="text-xs text-gray-500">(séparés par des virgules)</span>
        </label>
        <textarea
          value={formData.authors}
          onChange={(e) => handleChange('authors', e.target.value)}
          rows={2}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.authors ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Nom Auteur1, Nom Auteur2, ..."
        />
        {validationErrors.authors && (
          <p className="text-red-600 text-xs mt-1">{validationErrors.authors}</p>
        )}
      </div>

      {/* Résumé */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Résumé <span className="text-xs text-gray-500">(min. 20 caractères)</span>
        </label>
        <textarea
          value={formData.abstract}
          onChange={(e) => handleChange('abstract', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.abstract ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Résumé de la publication..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-gray-600 text-xs">{formData.abstract.length}/20 caractères</p>
          {validationErrors.abstract && (
            <p className="text-red-600 text-xs">{validationErrors.abstract}</p>
          )}
        </div>
      </div>

      {/* Journal/Conférence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Journal"
          value={formData.journal}
          onChange={(e) => handleChange('journal', e.target.value)}
          placeholder="Ex: Nature"
          error={validationErrors.journal}
        />
        <Input
          label="Conférence"
          value={formData.conference}
          onChange={(e) => handleChange('conference', e.target.value)}
          placeholder="Ex: ICML 2024"
          error={validationErrors.conference}
        />
      </div>

      {/* Date de publication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          type="date"
          label="Date de publication"
          value={formData.publicationDate}
          onChange={(e) => handleChange('publicationDate', e.target.value)}
          icon={<FaCalendar />}
          placeholder="YYYY-MM-DD"
          error={validationErrors.publicationDate}
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSetDateUnknown}
            fullWidth
          >
            Date inconnue
          </Button>
        </div>
      </div>

      {/* Année et Volume */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Année"
          type="number"
          value={formData.year}
          onChange={(e) => handleChange('year', e.target.value)}
          min={1900}
          max={2100}
          error={validationErrors.year}
        />
        <Input
          label="Volume"
          value={formData.volume}
          onChange={(e) => handleChange('volume', e.target.value)}
          placeholder="Ex: 32"
          error={validationErrors.volume}
        />
        <Input
          label="Numéro"
          value={formData.issue}
          onChange={(e) => handleChange('issue', e.target.value)}
          placeholder="Ex: 5"
          error={validationErrors.issue}
        />
      </div>

      {/* Pages */}
      <div>
        <Input
          label="Pages"
          value={formData.pages}
          onChange={(e) => handleChange('pages', e.target.value)}
          placeholder="Ex: 123-145"
          error={validationErrors.pages}
        />
      </div>

      {/* Éditeur */}
      <div>
        <Input
          label="Éditeur"
          value={formData.publisher}
          onChange={(e) => handleChange('publisher', e.target.value)}
          placeholder="Ex: Springer"
          error={validationErrors.publisher}
        />
      </div>

      {/* DOI, ISBN, ISSN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="DOI"
          value={formData.doi}
          onChange={(e) => handleChange('doi', e.target.value)}
          icon={<FaHashtag />}
          placeholder="Ex: 10.1234/..."
          error={validationErrors.doi}
        />
        <Input
          label="ISBN"
          value={formData.isbn}
          onChange={(e) => handleChange('isbn', e.target.value)}
          placeholder="Ex: 978-3-..."
          error={validationErrors.isbn}
        />
        <Input
          label="ISSN"
          value={formData.issn}
          onChange={(e) => handleChange('issn', e.target.value)}
          placeholder="Ex: 1234-5678"
          error={validationErrors.issn}
        />
      </div>

      {/* Mots-clés */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mots-clés <span className="text-xs text-gray-500">(séparés par des virgules)</span>
        </label>
        <textarea
          value={formData.keywords}
          onChange={(e) => handleChange('keywords', e.target.value)}
          rows={2}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
            validationErrors.keywords ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="machine learning, deep learning, ..."
        />
        {validationErrors.keywords && (
          <p className="text-red-600 text-xs mt-1">{validationErrors.keywords}</p>
        )}
      </div>

      {/* Citations et PDF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre de citations"
          type="number"
          value={formData.citations}
          onChange={(e) => handleChange('citations', e.target.value)}
          min={0}
          error={validationErrors.citations}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fichier PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statut publié */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => handleChange('isPublished', e.target.checked)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
          Publication publiée
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
          variant="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <Spinner size="sm" /> : (publication ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
