import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { AppDispatch, RootState } from '../../store';
import { getAllCollaborators, deleteCollaborator } from '../../store/collaborators/actions';
import { CollaboratorForm } from '../../components/forms/CollaboratorForm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import { FaPlus, FaSearch, FaUsers, FaEdit, FaTrash, FaGlobe, FaUniversity, FaMapMarkerAlt } from 'react-icons/fa';
import type { Collaborator } from '../../types';

export const CollaboratorsManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { collaborators, loading } = useSelector((state: RootState) => state.collaborators);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; collaborator: Collaborator | null }>({ isOpen: false, collaborator: null });
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ isVisible: false, message: '', type: 'success' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllCollaborators({}));
  }, [dispatch]);

  const filteredCollaborators = collaborators.filter(collab => {
    return collab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           collab.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (collab.country && collab.country.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleDelete = (collaborator: Collaborator) => {
    setDeleteConfirm({ isOpen: true, collaborator });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.collaborator) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteCollaborator(deleteConfirm.collaborator.id));
      showToast('Collaborateur supprimé avec succès', 'success');
      setDeleteConfirm({ isOpen: false, collaborator: null });
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    dispatch(getAllCollaborators({}));
    showToast(selectedCollaborator ? 'Collaborateur modifié avec succès' : 'Collaborateur créé avec succès', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'RESEARCHER':
        return <Badge variant="primary">Chercheur</Badge>;
      case 'PROFESSOR':
        return <Badge variant="success">Professeur</Badge>;
      case 'ENGINEER':
        return <Badge variant="warning">Ingénieur</Badge>;
      case 'STUDENT':
        return <Badge variant="info">Étudiant</Badge>;
      default:
        return <Badge variant="primary">{role}</Badge>;
    }
  };

  const columns = [
    {
      label: 'Collaborateur',
      key: 'name',
      render: (collab: Collaborator) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
            {collab.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{collab.name}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <FaUniversity className="mr-1" />
              {collab.institution}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Pays',
      key: 'country',
      render: (collab: Collaborator) => (
        <div className="flex items-center text-gray-700">
          <FaMapMarkerAlt className="mr-2 text-purple-500" />
          {collab.country || 'Non spécifié'}
        </div>
      ),
    },
    {
      label: 'Rôle',
      key: 'role',
      render: (collab: Collaborator) => <Badge variant="primary">Collaborateur</Badge>,
    },
    {
      label: 'Domaine',
      key: 'researchArea',
      render: (collab: Collaborator) => (
        <div className="text-sm text-gray-600">
          {collab.researchArea || 'Non spécifié'}
        </div>
      ),
    },
    {
      label: 'Actions',
      key: 'actions',
      render: (collab: Collaborator) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaEdit />}
            onClick={() => handleEdit(collab)}
            className="hover:bg-purple-50 hover:text-purple-600"
          >
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<FaTrash />}
            onClick={() => handleDelete(collab)}
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
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Réseau de Collaborateurs
            </h2>
            <p className="text-gray-600">
              Partenaires académiques internationaux
            </p>
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
              className="h-full shadow-xl hover:shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Nouveau Collaborateur
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Collaborateurs', value: collaborators.length, color: 'from-purple-500 via-fuchsia-500 to-pink-600', icon: FaUsers, bgColor: 'from-purple-50 to-pink-50' },
            { label: 'Institutions', value: new Set(collaborators.map(c => c.institution).filter(Boolean)).size, color: 'from-blue-500 via-indigo-500 to-violet-600', icon: FaUniversity, bgColor: 'from-blue-50 to-indigo-50' },
            { label: 'Internationaux', value: collaborators.filter(c => c.country && c.country !== 'Cameroun').length, color: 'from-green-500 via-emerald-500 to-teal-600', icon: FaGlobe, bgColor: 'from-green-50 to-emerald-50' },
            { label: 'Pays Partenaires', value: new Set(collaborators.map(c => c.country).filter(Boolean)).size, color: 'from-orange-500 via-amber-500 to-red-600', icon: FaMapMarkerAlt, bgColor: 'from-orange-50 to-red-50' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-xl p-6 border-2 border-white hover:shadow-2xl transition-all cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg transform rotate-3 hover:rotate-6 transition-transform`}>
                  <stat.icon className="text-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <Input
            placeholder="Rechercher par nom, institution ou pays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<FaSearch />}
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Table
            data={filteredCollaborators}
            columns={columns}
            isLoading={loading}
            emptyMessage={
              searchTerm
                ? 'Aucun collaborateur ne correspond à vos critères'
                : 'Aucun collaborateur. Commencez par en ajouter un !'
            }
          />
        </motion.div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCollaborator(null);
          }}
          title={selectedCollaborator ? '✏️ Modifier le collaborateur' : '✨ Nouveau collaborateur'}
          size="xl"
        >
          <CollaboratorForm
            collaborator={selectedCollaborator || undefined}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCollaborator(null);
            }}
            onSuccess={handleSuccess}
          />
        </Modal>

        {/* Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, collaborator: null })}
          onConfirm={confirmDelete}
          title="Supprimer le collaborateur ?"
          message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.collaborator?.name}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          type="danger"
          isLoading={isDeleting}
        />

        {/* Toast */}
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
