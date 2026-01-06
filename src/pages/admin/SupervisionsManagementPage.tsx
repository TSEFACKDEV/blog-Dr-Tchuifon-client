import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { AppDispatch, RootState } from '../../store';
import { getAllSupervisions, deleteSupervision } from '../../store/supervisions/actions';
import { SupervisionForm } from '../../components/forms/SupervisionForm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserGraduate, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import type { Supervision } from '../../types';

export const SupervisionsManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { supervisions, loading } = useSelector((state: RootState) => state.supervisions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervision, setSelectedSupervision] = useState<Supervision | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; supervision: Supervision | null }>({
    isOpen: false,
    supervision: null,
  });
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllSupervisions({}));
  }, [dispatch]);

  const filteredSupervisions = supervisions.filter(sup => {
    const matchesSearch = sup.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sup.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || sup.status === filterStatus;
    const matchesLevel = !filterLevel || sup.level === filterLevel;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const handleDelete = (supervision: Supervision) => {
    setDeleteConfirm({ isOpen: true, supervision });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.supervision) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteSupervision(deleteConfirm.supervision.id));
      showToast('Encadrement supprimé avec succès', 'success');
      dispatch(getAllSupervisions({}));
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, supervision: null });
    }
  };

  const handleEdit = (supervision: Supervision) => {
    setSelectedSupervision(supervision);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    dispatch(getAllSupervisions({}));
    showToast(selectedSupervision ? 'Encadrement modifié avec succès' : 'Encadrement créé avec succès', 'success');
  };

  const getStatusBadge = (status: string) => {
    const config = {
      IN_PROGRESS: { variant: 'warning' as const, label: 'En cours', icon: FaClock },
      COMPLETED: { variant: 'success' as const, label: 'Terminé', icon: FaCheckCircle },
      ABANDONED: { variant: 'danger' as const, label: 'Abandonné', icon: FaTimesCircle },
    };
    const { variant, label, icon: Icon } = config[status as keyof typeof config] || { variant: 'primary' as const, label: status, icon: FaClock };
    return <Badge variant={variant} icon={<Icon />}>{label}</Badge>;
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      INGENIEUR: 'Ingénieur',
      MASTER_2: 'Master 2',
      DOCTORAT: 'Doctorat',
      POST_DOC: 'Post-Doc',
    };
    return labels[level] || level;
  };

  const columns = [
    {
      key: 'student',
      label: 'Étudiant',
      width: '25%',
      render: (sup: Supervision) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold">
            {sup.studentName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{sup.studentName}</p>
            <p className="text-xs text-gray-500 mt-1">{getLevelLabel(sup.level)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'topic',
      label: 'Sujet',
      width: '30%',
      render: (sup: Supervision) => (
        <div>
          <p className="text-sm text-gray-900 font-medium line-clamp-2">{sup.topic}</p>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Période',
      width: '15%',
      render: (sup: Supervision) => (
        <div className="text-sm text-gray-600">
          <p>{new Date(sup.startDate).getFullYear()}</p>
          {sup.endDate && <p className="text-xs text-gray-500">→ {new Date(sup.endDate).getFullYear()}</p>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      width: '15%',
      render: (sup: Supervision) => getStatusBadge(sup.status),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (sup: Supervision) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(sup);
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
              handleDelete(sup);
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
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Encadrements Académiques
            </h2>
            <p className="text-gray-600">
              Suivi des étudiants et thèses
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
              className="h-full shadow-xl hover:shadow-2xl bg-gradient-to-r from-yellow-500 to-orange-500"
            >
              Nouvel Encadrement
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Encadrements', value: supervisions.length, color: 'from-yellow-500 via-amber-500 to-orange-600', icon: FaUserGraduate, bgColor: 'from-yellow-50 to-orange-50' },
            { label: 'En cours', value: supervisions.filter(s => s.status === 'IN_PROGRESS').length, color: 'from-blue-500 via-cyan-500 to-sky-600', icon: FaClock, bgColor: 'from-blue-50 to-cyan-50' },
            { label: 'Terminés', value: supervisions.filter(s => s.status === 'COMPLETED').length, color: 'from-green-500 via-emerald-500 to-teal-600', icon: FaCheckCircle, bgColor: 'from-green-50 to-emerald-50' },
            { label: 'Doctorats', value: supervisions.filter(s => s.level === 'DOCTORAT').length, color: 'from-purple-500 via-fuchsia-500 to-pink-600', icon: FaUserGraduate, bgColor: 'from-purple-50 to-pink-50' },
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Rechercher par étudiant ou sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FaSearch />}
              />
            </div>
            <Select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              options={[
                { value: '', label: 'Tous les niveaux' },
                { value: 'INGENIEUR', label: 'Ingénieur' },
                { value: 'MASTER_2', label: 'Master 2' },
                { value: 'DOCTORAT', label: 'Doctorat' },
                { value: 'POST_DOC', label: 'Post-Doc' },
              ]}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'IN_PROGRESS', label: 'En cours' },
                { value: 'COMPLETED', label: 'Terminé' },
                { value: 'ABANDONED', label: 'Abandonné' },
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
            data={filteredSupervisions}
            columns={columns}
            isLoading={loading}
            emptyMessage={
              searchTerm || filterStatus || filterLevel
                ? 'Aucun encadrement ne correspond à vos critères'
                : 'Aucun encadrement. Commencez par en ajouter un !'
            }
          />
        </motion.div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSupervision(null);
          }}
          title={selectedSupervision ? '✏️ Modifier l\'encadrement' : '✨ Nouvel encadrement'}
          size="xl"
        >
          <SupervisionForm
            supervision={selectedSupervision || undefined}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedSupervision(null);
            }}
            onSuccess={handleSuccess}
          />
        </Modal>

        {/* Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, supervision: null })}
          onConfirm={confirmDelete}
          title="Supprimer l'encadrement ?"
          message={`Êtes-vous sûr de vouloir supprimer l'encadrement de "${deleteConfirm.supervision?.studentName}" ? Cette action est irréversible.`}
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
