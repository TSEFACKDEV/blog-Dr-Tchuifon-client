import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { AppDispatch, RootState } from '../../store';
import { getAllPublications, deletePublication } from '../../store/publications/actions';
import { PublicationForm } from '../../components/forms/PublicationForm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaExternalLinkAlt, FaBook, FaCalendar, FaUsers } from 'react-icons/fa';
import type { Publication } from '../../types';

export const PublicationsManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publications, loading } = useSelector((state: RootState) => state.publications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; publication: Publication | null }>({
    isOpen: false,
    publication: null,
  });
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllPublications({}));
  }, [dispatch]);

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || pub.type === filterType;
    return matchesSearch && matchesType;
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const handleDelete = (publication: Publication) => {
    setDeleteConfirm({ isOpen: true, publication });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.publication) return;
    
    setIsDeleting(true);
    try {
      const deleteResult = await dispatch(deletePublication(deleteConfirm.publication.id));
      
      if (deleteResult.type.endsWith('/rejected')) {
        throw new Error(deleteResult.payload as string || 'Erreur de suppression');
      }
      
      const reloadResult = await dispatch(getAllPublications({}));
      if (reloadResult.type.endsWith('/rejected')) {
        throw new Error('Erreur lors du rechargement');
      }
      
      showToast('Publication supprimée avec succès', 'success');
      setDeleteConfirm({ isOpen: false, publication: null });
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la suppression', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    dispatch(getAllPublications({}));
    showToast(selectedPublication ? 'Publication modifiée avec succès' : 'Publication créée avec succès', 'success');
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      ARTICLE: 'Article',
      CONFERENCE: 'Conférence',
      BOOK_CHAPTER: 'Chapitre',
      THESIS: 'Thèse',
      PATENT: 'Brevet',
      POSTER: 'Poster',
    };
    return types[type] || type;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
      ARTICLE: 'primary',
      CONFERENCE: 'success',
      BOOK_CHAPTER: 'warning',
      THESIS: 'danger',
      PATENT: 'primary',
      POSTER: 'success',
    };
    return <Badge variant={variants[type] || 'primary'}>{getTypeLabel(type)}</Badge>;
  };

  const columns = [
    {
      key: 'title',
      label: 'Titre',
      width: '30%',
      render: (pub: Publication) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
            <FaBook />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{pub.title}</p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{pub.journal || pub.conference || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'authors',
      label: 'Auteurs',
      width: '20%',
      render: (pub: Publication) => (
        <div className="flex items-center gap-2 text-sm">
          <FaUsers className="text-gray-400" />
          <span className="text-gray-700 truncate">{pub.authors.slice(0, 2).join(', ')}</span>
          {pub.authors.length > 2 && (
            <Badge size="sm" variant="info">+{pub.authors.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'year',
      label: 'Année',
      width: '10%',
      render: (pub: Publication) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaCalendar className="text-gray-400" />
          {pub.year}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      width: '15%',
      render: (pub: Publication) => getTypeBadge(pub.type),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (pub: Publication) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(pub);
            }}
            className="hover:bg-primary-50 hover:text-primary-600"
          >
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<FaTrash />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(pub);
            }}
            className="hover:bg-red-50 hover:text-red-600"
          >
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                  Publications Scientifiques
                </h2>
                <p className="text-gray-600">
                  Gérez votre portefeuille de publications académiques
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="gradient"
              icon={<FaPlus />}
              onClick={() => setIsModalOpen(true)}
              fullWidth
              size="lg"
              className="h-full shadow-xl hover:shadow-2xl"
            >
              Nouvelle Publication
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Publications', value: publications.length, color: 'from-blue-500 via-blue-600 to-purple-600', icon: FaBook, bgColor: 'from-blue-50 to-purple-50' },
            { label: 'Articles', value: publications.filter(p => p.type === 'ARTICLE').length, color: 'from-purple-500 via-fuchsia-500 to-pink-600', icon: FaBook, bgColor: 'from-purple-50 to-pink-50' },
            { label: 'Conférences', value: publications.filter(p => p.type === 'CONFERENCE').length, color: 'from-green-500 via-emerald-500 to-teal-600', icon: FaBook, bgColor: 'from-green-50 to-emerald-50' },
            { label: 'Cette année', value: publications.filter(p => p.year === new Date().getFullYear()).length, color: 'from-orange-500 via-red-500 to-rose-600', icon: FaCalendar, bgColor: 'from-orange-50 to-red-50' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-xl p-6 border-2 border-white hover:shadow-2xl transition-all cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{stat.label}</p>
                  <p className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg transform rotate-3 hover:rotate-6 transition-transform`}>
                  <stat.icon className="text-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Rechercher par titre ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FaSearch />}
              />
            </div>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
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
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Table
            data={filteredPublications}
            columns={columns}
            isLoading={loading}
            emptyMessage={
              searchTerm || filterType
                ? 'Aucune publication ne correspond à vos critères'
                : 'Aucune publication. Commencez par en ajouter une !'
            }
          />
        </motion.div>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPublication(null);
          }}
          title={selectedPublication ? '✏️ Modifier la publication' : '✨ Nouvelle publication'}
          size="xl"
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

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, publication: null })}
          onConfirm={confirmDelete}
          title="Supprimer la publication ?"
          message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.publication?.title}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          type="danger"
          isLoading={isDeleting}
        />

        {/* Toast Notification */}
        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      </motion.div>
    </AdminLayout>
  );
};
