import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiExternalLink, FiCalendar, FiBook } from 'react-icons/fi';
import { FaEye, FaEdit, FaTrash, FaUsers, FaUniversity, FaArrowRight, FaAward } from 'react-icons/fa';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import type { Publication } from '../types';
import { PublicationType } from '../types';

interface PublicationCardProps {
  publication: Publication;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();
  
  const getTypeInfo = (type: PublicationType) => {
    const info = {
      ARTICLE: { 
        label: 'Article', 
        gradient: 'from-blue-500 via-blue-600 to-indigo-600',
        color: 'primary'
      },
      CONFERENCE: { 
        label: 'Conférence', 
        gradient: 'from-purple-500 via-purple-600 to-pink-600',
        color: 'info'
      },
      BOOK_CHAPTER: { 
        label: 'Chapitre', 
        gradient: 'from-teal-500 via-cyan-600 to-blue-600',
        color: 'warning'
      },
      THESIS: { 
        label: 'Thèse', 
        gradient: 'from-red-500 via-rose-600 to-pink-600',
        color: 'success'
      },
      PATENT: { 
        label: 'Brevet', 
        gradient: 'from-orange-500 via-amber-600 to-yellow-600',
        color: 'danger'
      },
      POSTER: { 
        label: 'Poster', 
        gradient: 'from-gray-500 via-gray-600 to-slate-600',
        color: 'gray'
      },
    };
    return info[type] || info.ARTICLE;
  };

  const typeInfo = getTypeInfo(publication.type);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group"
    >
      {/* Gradient border */}
      <div className={`relative bg-gradient-to-br ${typeInfo.gradient} rounded-2xl p-[2px] shadow-xl hover:shadow-2xl transition-all duration-300`}>
        <div className="bg-white rounded-2xl p-6 h-full">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {/* Type Badge with Year */}
              <motion.div 
                className="flex items-center justify-between mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${typeInfo.gradient} text-white text-sm font-semibold shadow-md`}>
                  <FiFileText className="w-4 h-4" />
                  <span>{typeInfo.label}</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {publication.year}
                </motion.div>
              </motion.div>

              {/* Title with gradient effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to={`/publications/${publication.slug}`}
                  className={`text-xl font-bold mb-3 line-clamp-2 bg-gradient-to-r ${typeInfo.gradient} bg-clip-text text-transparent hover:scale-[1.02] transition-transform duration-200 block`}
                >
                  {publication.title}
                </Link>
              </motion.div>

              {/* Authors */}
              <motion.div 
                className="flex items-start gap-2 text-gray-600 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FaUsers className="mt-1 flex-shrink-0 text-blue-500" />
                <p className="text-sm">
                  <span className="font-semibold">Auteurs: </span>
                  {publication.authors.slice(0, 3).join(', ')}
                  {publication.authors.length > 3 && <span className="text-blue-600 font-medium"> +{publication.authors.length - 3} autres</span>}
                </p>
              </motion.div>

              {/* Publication Info */}
              {(publication.journal || publication.conference) && (
                <motion.div 
                  className="flex items-start gap-2 text-gray-600 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FaUniversity className="mt-1 flex-shrink-0 text-purple-500" />
                  <p className="text-sm italic line-clamp-1">
                    {publication.journal || publication.conference}
                  </p>
                </motion.div>
              )}

              {/* Citations */}
              {publication.citations > 0 && (
                <motion.div 
                  className="flex items-center gap-2 text-gray-600 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <FaAward className="text-orange-500" />
                  <span className="text-sm font-semibold">{publication.citations} citations</span>
                </motion.div>
              )}

              {/* Keywords */}
              {publication.keywords.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {publication.keywords.slice(0, 4).map((keyword, index) => (
                    <span key={index} className={`px-2 py-1 bg-gradient-to-r ${typeInfo.gradient} bg-opacity-10 text-xs rounded-full font-medium`}>
                      {keyword}
                    </span>
                  ))}
                </motion.div>
              )}

              {/* Abstract Preview */}
              <motion.p 
                className="text-sm text-gray-700 line-clamp-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {publication.abstract}
              </motion.p>

              {/* Footer with actions */}
              {!isAdmin && (
                <motion.div 
                  className="flex items-center justify-between pt-4 border-t border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex gap-2">
                    {publication.pdfUrl && (
                      <a
                        href={publication.pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <FiDownload className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    )}
                    {publication.doi && (
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>DOI</span>
                      </a>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => navigate(`/publications/${publication.slug}`)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${typeInfo.gradient} text-white text-xs font-semibold shadow-md cursor-pointer`}
                  >
                    <span>Voir détails</span>
                    <FaArrowRight />
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t md:border-t-0 md:mt-0 md:pt-0 md:border-l md:pl-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/publications/${publication.slug}`)}
                  className="w-full"
                >
                  <FaEye className="mr-1" />
                  Voir
                </Button>
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onEdit}
                    className="w-full"
                  >
                    <FaEdit className="mr-1" />
                    Modifier
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onDelete}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <FaTrash className="mr-1" />
                    Supprimer
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative corner element */}
      <motion.div
        className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${typeInfo.gradient} rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default PublicationCard;
