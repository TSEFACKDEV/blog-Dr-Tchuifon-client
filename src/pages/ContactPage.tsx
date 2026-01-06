import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Card from '../components/ui/Card';
import type { AppDispatch, RootState } from '../store';
import { sendContactMessage } from '../store/contact/actions';
import { FaEnvelope, FaUser, FaPhone, FaMapMarkerAlt, FaBuilding, FaGlobe, FaPaperPlane } from 'react-icons/fa';

export const ContactPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.contact);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    const result = await dispatch(sendContactMessage(formData));
    
    if (sendContactMessage.fulfilled.match(result)) {
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const contactInfo = [
    {
      icon: FaBuilding,
      title: 'Institution',
      content: 'École Nationale Supérieure Polytechnique de Douala (ENSPD)',
      subtitle: 'Université de Douala',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Adresse',
      content: 'PK 17 Douala, Cameroun',
      subtitle: 'Campus ENSPD - BP 2701',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: FaPhone,
      title: 'Téléphones',
      content: '+237 674 78 00 94',
      subtitle: '+237 696 42 35 65',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: FaEnvelope,
      title: 'Emails',
      content: 'tchuifon@gmail.com',
      subtitle: 'donald.tchuifon@enspd-udo.cn',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: FaGlobe,
      title: 'Site Web',
      content: 'www.ensp-udo.com',
      link: 'https://www.ensp-udo.com',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-16 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-100/20 to-accent-100/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-7xl mx-auto"
          >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-6 shadow-lg"
              >
                <FaPaperPlane className="text-3xl text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
                Restons en contact
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Une question, un projet de collaboration ou simplement envie d'échanger ?
                <br />
                <span className="font-semibold text-primary-600">Je suis à votre écoute</span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Contact Info Cards - Left Side */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group"
                    >
                      <Card glass className="relative overflow-hidden">
                        {/* Gradient Background on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        
                        <div className="relative flex items-start gap-4">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-lg`}
                          >
                            <Icon className="text-xl text-white" />
                          </motion.div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors break-words"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <>
                                <p className="text-gray-700 font-medium text-sm break-words">{info.content}</p>
                                {info.subtitle && (
                                  <p className="text-gray-500 text-xs mt-1 break-words">{info.subtitle}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}

                {/* Department Info Card */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 opacity-90" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
                  
                  <Card className="relative bg-transparent border-none shadow-2xl">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <FaBuilding className="text-2xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Département</h3>
                        <p className="text-primary-100 text-sm">Génie des Procédés</p>
                      </div>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Enseignant-Chercheur spécialisé en <span className="font-semibold">Chimie-Physique</span> et <span className="font-semibold">Génie des Procédés</span>
                    </p>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Contact Form - Right Side */}
              <motion.div variants={itemVariants} className="lg:col-span-3">
                <Card glass className="backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Envoyez un message</h2>
                  </div>

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert variant="success" className="mb-6">
                        ✨ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
                      </Alert>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert variant="error" className="mb-6">
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nom complet"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        icon={<FaUser />}
                        placeholder="Votre nom"
                      />

                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        icon={<FaEnvelope />}
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Téléphone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={<FaPhone />}
                        placeholder="+237 6XX XX XX XX"
                      />

                      <Input
                        label="Sujet"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Objet de votre message"
                      />
                    </div>

                    <Textarea
                      label="Votre message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                      placeholder="Écrivez votre message ici..."
                    />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="gradient"
                        size="lg"
                        fullWidth
                        loading={loading}
                        icon={<FaPaperPlane />}
                      >
                        Envoyer le message
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </motion.div>
            </div>

            {/* Bottom decorative text */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-16"
            >
              <p className="text-gray-500 text-sm">
                💡 Temps de réponse moyen : <span className="font-semibold text-primary-600">24-48 heures</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};
