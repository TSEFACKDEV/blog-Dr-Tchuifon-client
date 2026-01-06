import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { AppDispatch, RootState } from '../../store';
import { getAllPublications, deletePublication } from '../../store/publications/actions';
import { PublicationForm } from '../../components/forms/PublicationForm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import Table from '../../components/ui/Table';
import { FaPlus, FaSearch, FaBook, FaEdit, FaTrash, FaCalendar, FaUsers } from 'react-icons/fa';
import type { Publication } from '../../types';

export const PublicationsManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publications, loading } = useSelector((state: RootState) => state.publications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);

  useEffect(() => {
    dispatch(getAllPublications({}));
  }, [dispatch]);

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || pub.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      await dispatch(deletePublication(id));
    }
  };

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    dispatch(getAllPublications({}));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-up">
              Gestion des Publications
            </h2>
            <p className="text-gray-600 animate-slide-up animation-delay-100">
              {publications.length} publication{publications.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={() => setIsModalOpen(true)}
            className="animate-slide-up animation-delay-200 hover:scale-105 transition-transform"
          >
            Nouvelle Publication
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up animation-delay-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Rechercher par titre ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FaSearch />}
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-blue-500"
              options={[
                { value: '', label: 'Tous les types' },
                { value: 'ARTICLE', label: 'Article' },
                { value: 'CONFERENCE', label: 'Conférence' },
                { value: 'BOOK_CHAPTER', label: 'Chapitre' },
                { value: 'THESIS', label: 'Thèse' },
                { value: 'PATENT', label: 'Brevet' },
                { value: 'POSTER', label: 'Poster' },
              ]}
            />
          </div>
        </div>

        {/* Publications Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm animate-slide-up">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune publication trouvée</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre première publication'}
            </p>
            {!searchTerm && !filterType && (
              <Button
                variant="primary"
                icon={<FaPlus />}
                onClick={() => setIsModalOpen(true)}
              >
                Ajouter une publication
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPublications.map((publication, index) => (
              <div
                key={publication.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="group hover:scale-105 transition-all duration-300">
                  <PublicationCard
                    publication={publication}
                    onEdit={() => handleEdit(publication)}
                    onDelete={() => handleDelete(publication.id)}
                    isAdmin
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPublication(null);
          }}
          title={selectedPublication ? 'Modifier la publication' : 'Nouvelle publication'}
        >
          <PublicationForm
            publication={selectedPublication || undefined}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedPublication(null);
            }}
            onSuccess={handleSuccess}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
};
