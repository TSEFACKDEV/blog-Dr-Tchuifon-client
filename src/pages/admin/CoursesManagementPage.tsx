import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { AppDispatch, RootState } from '../../store';
import { getAllCourses, deleteCourse } from '../../store/cours/actions';
import { CourseForm } from '../../components/forms/CourseForm';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaGraduationCap, FaBookOpen, FaClock, FaUsers } from 'react-icons/fa';
import type { Course } from '../../types';

export const CoursesManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; course: Course | null }>({
    isOpen: false,
    course: null,
  });
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isVisible: false,
    message: '',
    type: 'success',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllCourses({}));
  }, [dispatch]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = !filterLevel || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const handleDelete = (course: Course) => {
    setDeleteConfirm({ isOpen: true, course });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.course) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteCourse(deleteConfirm.course.id));
      showToast('Cours supprimé avec succès', 'success');
      dispatch(getAllCourses({}));
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, course: null });
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    dispatch(getAllCourses({}));
    showToast(selectedCourse ? 'Cours modifié avec succès' : 'Cours créé avec succès', 'success');
  };

  const getLevelBadge = (level: string) => {
    const config = {
      LICENCE: { variant: 'success' as const, label: 'Licence' },
      MASTER: { variant: 'primary' as const, label: 'Master' },
      INGENIEUR: { variant: 'warning' as const, label: 'Ingénieur' },
      DOCTORAT: { variant: 'danger' as const, label: 'Doctorat' },
    };
    const { variant, label } = config[level as keyof typeof config] || { variant: 'primary' as const, label: level };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const columns = [
    {
      key: 'title',
      label: 'Cours',
      width: '35%',
      render: (course: Course) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
            <FaBookOpen />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{course.title}</p>
            <p className="text-xs text-gray-500 mt-1">Code: {course.code || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      label: 'Niveau',
      width: '15%',
      render: (course: Course) => getLevelBadge(course.level),
    },
    {
      key: 'hours',
      label: 'Volume horaire',
      width: '15%',
      render: (course: Course) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaClock className="text-gray-400" />
          {course.hours || 0}h
        </div>
      ),
    },
    {
      key: 'semester',
      label: 'Semestre',
      width: '10%',
      render: (course: Course) => (
        <span className="text-sm text-gray-700">S{course.semester}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<FaEdit />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(course);
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
              handleDelete(course);
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
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Catalogue des Cours
            </h2>
            <p className="text-gray-600">
              Gérez vos enseignements et programmes
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
              className="h-full shadow-xl hover:shadow-2xl bg-gradient-to-r from-emerald-500 to-cyan-500"
            >
              Nouveau Cours
            </Button>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Cours', value: courses.length, color: 'from-emerald-500 via-teal-500 to-cyan-600', icon: FaBookOpen, bgColor: 'from-emerald-50 to-cyan-50' },
            { label: 'Licence', value: courses.filter(c => c.level === 'LICENCE').length, color: 'from-blue-500 via-indigo-500 to-purple-600', icon: FaGraduationCap, bgColor: 'from-blue-50 to-indigo-50' },
            { label: 'Master', value: courses.filter(c => c.level === 'MASTER').length, color: 'from-purple-500 via-violet-500 to-pink-600', icon: FaGraduationCap, bgColor: 'from-purple-50 to-pink-50' },
            { label: 'Ingénieur', value: courses.filter(c => c.level === 'INGENIEUR').length, color: 'from-orange-500 via-red-500 to-rose-600', icon: FaUsers, bgColor: 'from-orange-50 to-red-50' },
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
                placeholder="Rechercher par titre ou code..."
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
                { value: 'LICENCE', label: 'Licence' },
                { value: 'MASTER', label: 'Master' },
                { value: 'INGENIEUR', label: 'Ingénieur' },
                { value: 'DOCTORAT', label: 'Doctorat' },
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
            data={filteredCourses}
            columns={columns}
            isLoading={loading}
            emptyMessage={
              searchTerm || filterLevel
                ? 'Aucun cours ne correspond à vos critères'
                : 'Aucun cours. Commencez par en ajouter un !'
            }
          />
        </motion.div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
          title={selectedCourse ? '✏️ Modifier le cours' : '✨ Nouveau cours'}
          size="xl"
        >
          <CourseForm
            course={selectedCourse || undefined}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCourse(null);
            }}
            onSuccess={handleSuccess}
          />
        </Modal>

        {/* Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, course: null })}
          onConfirm={confirmDelete}
          title="Supprimer le cours ?"
          message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.course?.title}" ? Cette action est irréversible.`}
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
