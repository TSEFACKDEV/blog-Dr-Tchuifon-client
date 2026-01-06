import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import type { AppDispatch, RootState } from '../../store';
import { getAllPublications } from '../../store/publications/actions';
import { getAllCourses } from '../../store/cours/actions';
import { getAllSupervisions } from '../../store/supervisions/actions';
import { getAllCollaborators } from '../../store/collaborators/actions';
import { AdminLayout } from '../../layouts/AdminLayout';
import StatsCard from '../../components/StatsCard';
import Spinner from '../../components/ui/Spinner';
import { 
  FaBook, 
  FaGraduationCap, 
  FaUsers, 
  FaEnvelope,
  FaUserGraduate,
  FaTrophy,
  FaEye,
  FaChartLine
} from 'react-icons/fa';

interface RecentActivityProps {
  type: 'publication' | 'course' | 'supervision' | 'message';
  title: string;
  description: string;
  time: string;
}

// Fonction pour calculer le h-index
function calculateHIndex(publications: any[]): number {
  const citations = publications
    .map(p => p.citations || 0)
    .sort((a, b) => b - a);
  
  let hIndex = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  return hIndex;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ type, title, description, time }) => {
  const getIcon = () => {
    switch (type) {
      case 'publication': return <FaBook className="text-blue-500" />;
      case 'course': return <FaGraduationCap className="text-green-500" />;
      case 'supervision': return <FaUserGraduate className="text-purple-500" />;
      case 'message': return <FaEnvelope className="text-red-500" />;
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow group-hover:scale-110 transition-transform">
        {getIcon()}
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { publications, loading: publicationsLoading } = useSelector((state: RootState) => state.publications);
  const { courses } = useSelector((state: RootState) => state.courses);
  const { supervisions } = useSelector((state: RootState) => state.supervisions);
  const { collaborators } = useSelector((state: RootState) => state.collaborators);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getAllPublications({}));
    dispatch(getAllCourses({}));
    dispatch(getAllSupervisions({}));
    dispatch(getAllCollaborators({}));
  }, [dispatch]);

  // Calculer les statistiques réelles
  const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations || 0), 0);
  const hIndex = calculateHIndex(publications);
  const supervisionEnCours = supervisions.filter(s => s.status === 'IN_PROGRESS').length;

  if (publicationsLoading && publications.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  const recentActivities: RecentActivityProps[] = [];

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Tableau de bord
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenue {user?.profile?.fullName || 'Administrateur'}! Voici un aperçu de vos activités académiques.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { to: '/admin/publications', value: publications.length, title: 'Publications', subtitle: 'Total des publications', icon: FaBook, color: 'blue', delay: 0.2 },
            { to: '/admin/courses', value: courses.length, title: 'Cours', subtitle: 'Cours actifs', icon: FaGraduationCap, color: 'green', delay: 0.25 },
            { to: '/admin/supervisions', value: supervisions.length, title: 'Encadrements', subtitle: `${supervisionEnCours} en cours`, icon: FaUsers, color: 'yellow', delay: 0.3 },
            { to: '/admin/collaborators', value: collaborators.length, title: 'Collaborateurs', subtitle: 'Réseau international', icon: FaUsers, color: 'purple', delay: 0.35 },
          ].map((stat) => (
            <Link key={stat.to} to={stat.to}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color as any}
                  subtitle={stat.subtitle}
                />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Advanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Citations', value: totalCitations, badge: `H-index: ${hIndex}`, color: 'from-blue-500 to-purple-600', icon: FaTrophy, delay: 0.4 },
            { label: 'Supervisions Actives', value: supervisionEnCours, badge: `${supervisions.length} total`, color: 'from-green-500 to-emerald-600', icon: FaUserGraduate, delay: 0.45 },
            { label: 'Collaborations', value: collaborators.length, badge: 'Réseau international', color: 'from-orange-500 to-pink-600', icon: FaUsers, delay: 0.5 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay }}
              whileHover={{ scale: 1.03 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl p-6 text-white cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                  <p className="text-5xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="text-6xl opacity-20">
                  <stat.icon />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {stat.badge}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activities and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Activités récentes
              </h2>
              <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1 font-medium">
                <FaEye />
                Voir tout
              </span>
            </div>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-12">
                  <FaChartLine className="text-5xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <RecentActivity key={index} {...activity} />
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { to: '/admin/publications', label: 'Nouvelle Publication', sublabel: 'Ajouter une publication', icon: FaBook, color: 'blue', delay: 0.75 },
                { to: '/admin/courses', label: 'Nouveau Cours', sublabel: 'Créer un cours', icon: FaGraduationCap, color: 'green', delay: 0.8 },
                { to: '/admin/supervisions', label: 'Nouvel Encadrement', sublabel: 'Ajouter un étudiant', icon: FaUserGraduate, color: 'purple', delay: 0.85 },
                { to: '/admin/profile', label: 'Mon Profil', sublabel: 'Gérer le profil', icon: FaUsers, color: 'pink', delay: 0.9 },
              ].map((action) => (
                <Link key={action.to} to={action.to}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: action.delay }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 bg-${action.color}-50 rounded-xl hover:bg-${action.color}-100 transition-all group cursor-pointer shadow-md hover:shadow-lg`}
                  >
                    <action.icon className={`text-3xl text-${action.color}-600 mb-3 group-hover:scale-110 transition-transform`} />
                    <h3 className="font-semibold text-gray-900 text-sm">{action.label}</h3>
                    <p className="text-xs text-gray-600 mt-1">{action.sublabel}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
};
