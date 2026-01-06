import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppDispatch, RootState } from '../../store';
import { getAllContactMessages, markMessageAsRead, deleteContactMessage } from '../../store/contact/actions';
import { AdminLayout } from '../../layouts/AdminLayout';
import Card from "../../components/ui/Card";
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Toast from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { FaEnvelope, FaCalendar, FaCheckCircle, FaEye, FaTrash, FaReply, FaInbox, FaFilter } from 'react-icons/fa';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  sentAt: string;
}

export const MessagesManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading } = useSelector((state: RootState) => state.contact);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; message: Message | null }>({ isOpen: false, message: null });
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'warning' | 'info' }>({ isVisible: false, message: '', type: 'success' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllContactMessages({}));
  }, [dispatch]);

  const filteredMessages = messages.filter((msg: Message) => {
    if (filter === 'unread') return !msg.isRead;
    if (filter === 'read') return msg.isRead;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    await dispatch(markMessageAsRead(id));
    dispatch(getAllContactMessages({}));
    showToast('Message marqué comme lu', 'success');
  };

  const handleDelete = (message: Message) => {
    setDeleteConfirm({ isOpen: true, message });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.message) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteContactMessage(deleteConfirm.message.id));
      if (selectedMessage?.id === deleteConfirm.message.id) {
        setSelectedMessage(null);
      }
      dispatch(getAllContactMessages({}));
      showToast('Message supprimé avec succès', 'success');
      setDeleteConfirm({ isOpen: false, message: null });
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReply = (message: Message) => {
    window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const unreadCount = messages.filter((msg: Message) => !msg.isRead).length;

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
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Messagerie
            </h2>
            <p className="text-gray-600">
              {messages.length} message{messages.length > 1 ? 's' : ''} • {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-end"
          >
            <Badge variant="danger" size="lg" className="px-6 py-3 shadow-lg">
              {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
            </Badge>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Messages', value: messages.length, color: 'from-blue-500 via-cyan-500 to-sky-600', icon: FaEnvelope, bgColor: 'from-blue-50 to-cyan-50' },
            { label: 'Non lus', value: unreadCount, color: 'from-orange-500 via-amber-500 to-red-600', icon: FaEye, bgColor: 'from-orange-50 to-red-50' },
            { label: 'Lus', value: messages.length - unreadCount, color: 'from-green-500 via-emerald-500 to-teal-600', icon: FaCheckCircle, bgColor: 'from-green-50 to-emerald-50' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaInbox className="mr-2 text-blue-500" />
                Boîte de réception
              </h3>
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-400" />
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  options={[
                    { value: 'all', label: 'Tous' },
                    { value: 'unread', label: 'Non lus' },
                    { value: 'read', label: 'Lus' },
                  ]}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center py-8"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </motion.div>
                ) : filteredMessages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12 bg-gray-50 rounded-xl"
                  >
                    <FaInbox className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun message</p>
                  </motion.div>
                ) : (
                  filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                          selectedMessage?.id === message.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : !message.isRead
                            ? 'bg-white border-l-4 border-blue-500'
                            : 'bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.isRead) {
                            handleMarkAsRead(message.id);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {message.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className={`font-semibold text-sm ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                {message.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate max-w-[150px]">{message.email}</p>
                            </div>
                          </div>
                          {!message.isRead && (
                            <Badge variant="primary" size="sm">New</Badge>
                          )}
                        </div>
                        <h5 className={`text-sm font-medium mb-1 truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.subject}
                        </h5>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {message.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <FaCalendar />
                          {formatDate(message.sentAt)}
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Message Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                <motion.div
                  key={selectedMessage.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {selectedMessage.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h3>
                              <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                            </div>
                          </div>
                          {selectedMessage.isRead ? (
                            <Badge variant="success" icon={<FaCheckCircle />}>Lu</Badge>
                          ) : (
                            <Badge variant="primary" icon={<FaEye />}>Non lu</Badge>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {selectedMessage.subject}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Reçu le {formatDate(selectedMessage.sentAt)}
                        </p>
                      </div>

                      {/* Message Body */}
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 border-t border-gray-200 pt-4">
                        <Button
                          variant="primary"
                          icon={<FaReply />}
                          onClick={() => handleReply(selectedMessage)}
                          className="hover:scale-105 transition-transform"
                        >
                          Répondre
                        </Button>
                        <Button
                          variant="danger"
                          icon={<FaTrash />}
                          onClick={() => handleDelete(selectedMessage)}
                          className="hover:scale-105 transition-transform"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl min-h-[400px]"
                >
                  <div className="text-center">
                    <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Sélectionnez un message
                    </h3>
                    <p className="text-gray-500">
                      Cliquez sur un message dans la liste pour le lire
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Confirmation */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, message: null })}
          onConfirm={confirmDelete}
          title="Supprimer le message ?"
          message={`Êtes-vous sûr de vouloir supprimer le message de "${deleteConfirm.message?.name}" ? Cette action est irréversible.`}
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
