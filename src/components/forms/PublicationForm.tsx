import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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

export const PublicationForm: React.FC<PublicationFormProps> = ({ publication, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: publication?.title || '',
    abstract: publication?.abstract || '',
    authors: publication?.authors.join(', ') || '',
    journal: publication?.journal || '',
    conference: publication?.conference || '',
    publicationDate: publication?.publicationDate.split('T')[0] || new Date().toISOString().split('T')[0],
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: any = {
        ...formData,
        authors: formData.authors.split(',').map((a: string) => a.trim()).filter(Boolean),
        keywords: formData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        year: parseInt(formData.year.toString()),
        citations: parseInt(formData.citations.toString()),
      };

      if (pdfFile) {
        data.pdf = pdfFile;
      }

      if (publication) {
        await dispatch(updatePublication({ id: publication.id, data }));
      } else {
        await dispatch(createPublication(data));
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
      {/* Titre */}
      <div>
        <Input
          label="Titre *"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          icon={<FaBook />}
          required
          placeholder="Titre de la publication"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type de publication *</label>
        <Select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          required
          options={[
            { value: 'ARTICLE', label: 'Article de journal' },
            { value: 'CONFERENCE', label: 'Conférence' },
            { value: 'BOOK_CHAPTER', label: 'Chapitre de livre' },
            { value: 'THESIS', label: 'Thèse' },
            { value: 'PATENT', label: 'Brevet' },
            { value: 'POSTER', label: 'Poster' },
          ]}
        />
      </div>

      {/* Auteurs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auteurs * <span className="text-xs text-gray-500">(séparés par des virgules)</span>
        </label>
        <textarea
          value={formData.authors}
          onChange={(e) => handleChange('authors', e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nom Auteur1, Nom Auteur2, ..."
          required
        />
      </div>

      {/* Résumé */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Résumé *</label>
        <textarea
          value={formData.abstract}
          onChange={(e) => handleChange('abstract', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Résumé de la publication..."
          required
        />
      </div>

      {/* Journal/Conférence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Journal"
          value={formData.journal}
          onChange={(e) => handleChange('journal', e.target.value)}
          placeholder="Nom du journal"
        />
        <Input
          label="Conférence"
          value={formData.conference}
          onChange={(e) => handleChange('conference', e.target.value)}
          placeholder="Nom de la conférence"
        />
      </div>

      {/* Année et Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Année *"
          type="number"
          value={formData.year}
          onChange={(e) => handleChange('year', e.target.value)}
          icon={<FaCalendar />}
          required
          min={1900}
          max={2100}
        />
        <Input
          label="Date de publication *"
          type="date"
          value={formData.publicationDate}
          onChange={(e) => handleChange('publicationDate', e.target.value)}
          required
        />
      </div>

      {/* Volume, Issue, Pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Volume"
          value={formData.volume}
          onChange={(e) => handleChange('volume', e.target.value)}
          placeholder="Vol. X"
        />
        <Input
          label="Numéro"
          value={formData.issue}
          onChange={(e) => handleChange('issue', e.target.value)}
          placeholder="No. X"
        />
        <Input
          label="Pages"
          value={formData.pages}
          onChange={(e) => handleChange('pages', e.target.value)}
          placeholder="1-10"
        />
      </div>

      {/* Éditeur */}
      <div>
        <Input
          label="Éditeur"
          value={formData.publisher}
          onChange={(e) => handleChange('publisher', e.target.value)}
          placeholder="Nom de l'éditeur"
        />
      </div>

      {/* DOI, ISBN, ISSN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="DOI"
          value={formData.doi}
          onChange={(e) => handleChange('doi', e.target.value)}
          placeholder="10.xxxx/xxxxx"
        />
        <Input
          label="ISBN"
          value={formData.isbn}
          onChange={(e) => handleChange('isbn', e.target.value)}
          placeholder="978-xxx-xxx"
        />
        <Input
          label="ISSN"
          value={formData.issn}
          onChange={(e) => handleChange('issn', e.target.value)}
          placeholder="xxxx-xxxx"
        />
      </div>

      {/* Mots-clés */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mots-clés <span className="text-xs text-gray-500">(séparés par des virgules)</span>
        </label>
        <Input
          value={formData.keywords}
          onChange={(e) => handleChange('keywords', e.target.value)}
          icon={<FaHashtag />}
          placeholder="mot-clé1, mot-clé2, ..."
        />
      </div>

      {/* Citations */}
      <div>
        <Input
          label="Nombre de citations"
          type="number"
          value={formData.citations}
          onChange={(e) => handleChange('citations', e.target.value)}
          min={0}
        />
      </div>

      {/* PDF */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fichier PDF
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {publication?.pdfUrl && (
          <p className="text-xs text-gray-500 mt-1">Fichier actuel: {publication.pdfUrl}</p>
        )}
      </div>

      {/* Statut publication */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => handleChange('isPublished', e.target.checked)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
          Publication publique (visible sur le site)
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
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <Spinner size="sm" /> : (publication ? 'Mettre à jour' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
