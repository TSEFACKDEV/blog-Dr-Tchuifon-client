import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaGraduationCap, FaUsers, FaEnvelope, FaArrowRight, FaAward, FaStar } from 'react-icons/fa';
import { MainLayout } from '../layouts/MainLayout';
import type { AppDispatch, RootState } from '../store';
import { getPublicProfile } from '../store/profile/actions';
import { getAllPublications } from '../store/publications/actions';
import { getAllCourses } from '../store/cours/actions';
import { getAllSupervisions } from '../store/supervisions/actions';
import { getAllCollaborators } from '../store/collaborators/actions';
import PublicationCard from '../components/PublicationCard';
import StatsCard from '../components/StatsCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getImageUrl, getInitials } from '../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.profile);
  const { publications, loading: publicationsLoading } = useSelector((state: RootState) => state.publications);
  const { courses } = useSelector((state: RootState) => state.courses);
  const { supervisions } = useSelector((state: RootState) => state.supervisions);
  const { collaborators } = useSelector((state: RootState) => state.collaborators);

  useEffect(() => {
    dispatch(getPublicProfile());
    dispatch(getAllPublications({ limit: 3 }));
    dispatch(getAllCourses({}));
    dispatch(getAllSupervisions({}));
    dispatch(getAllCollaborators({}));
  }, [dispatch]);

  if (publicationsLoading && !profile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section - Modernisé */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-primary-800 text-white py-20 md:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto"
          >
            {/* Photo de profil */}
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative"
              >
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                  {getImageUrl(profile?.photoUrl) ? (
                    <img
                      src={getImageUrl(profile?.photoUrl)!}
                      alt={profile?.fullName || 'Profil'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-6xl font-bold">
                            ${getInitials(profile?.fullName || 'User')}
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-6xl font-bold">
                      {getInitials(profile?.fullName || 'User')}
                    </div>
                  )}
                </div>
                {/* Floating Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -top-4 -right-4 bg-white text-primary-600 p-3 rounded-2xl shadow-lg"
                >
                  <FaAward className="text-2xl" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Informations */}
            <div className="flex-1 text-center md:text-left">
              <motion.div variants={itemVariants}>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg"
                >
                  {profile?.fullName || 'Dr. TCHUIFON TCHUIFON Donald Ricoul'}
                </motion.h1>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <p className="text-xl md:text-2xl text-primary-100 mb-4 font-light">
                  {profile?.title || 'Doctorat/Ph.D en Chimie - Physique'}
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2 text-primary-100 mb-8">
                <p className="text-lg">
                  {profile?.institution || 'École Nationale Supérieure Polytechnique de Douala'}
                </p>
                <p className="text-base opacity-90">
                  {profile?.department || 'Département de Génie des Procédés'}
                </p>
              </motion.div>

              {profile?.bio && (
                <motion.div variants={itemVariants}>
                  <p className="text-lg text-primary-50 mb-8 leading-relaxed max-w-2xl">
                    {profile.bio.split('\n')[0]}
                  </p>
                </motion.div>
              )}

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <Link to="/publications">
                  <Button variant="gradient" size="lg" icon={<FaBook />}>
                    Mes Publications
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="lg" icon={<FaEnvelope />}>
                    Me contacter
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      {profile?.bio && (
        <section className="py-20 bg-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-100 rounded-full blur-3xl opacity-50"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-12 text-center">
                Profil Académique
              </h2>
              <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {profile.bio.split('\n').map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-4 last:mb-0"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
                
                {/* Spécialisations */}
                {profile.specializations && profile.specializations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-8 border-t border-gray-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaStar className="text-accent-500" />
                      Domaines d'expertise
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.specializations.map((spec, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                        >
                          {spec}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text text-center mb-12"
          >
            En quelques chiffres
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Publications"
                value={publications.length}
                icon={FaBook}
                color="blue"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Cours"
                value={courses.length}
                icon={FaGraduationCap}
                color="green"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Encadrements"
                value={supervisions.length}
                icon={FaUsers}
                color="yellow"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatsCard
                title="Collaborateurs"
                value={collaborators.length}
                icon={FaUsers}
                color="purple"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text">Publications récentes</h2>
            <motion.div whileHover={{ x: 5 }}>
              <Link to="/publications" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group">
                Voir tout 
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {publications.slice(0, 3).map((publication) => (
              <motion.div key={publication.id} variants={itemVariants}>
                <PublicationCard publication={publication} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-accent-600 to-primary-800 text-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-shadow-lg">
              Une question ? Un projet ?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              N'hésitez pas à me contacter pour toute collaboration, information ou projet de recherche.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact">
                <Button variant="secondary" size="lg" icon={<FaEnvelope />}>
                  Me contacter maintenant
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};
