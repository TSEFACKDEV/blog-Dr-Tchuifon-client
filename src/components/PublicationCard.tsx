import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar } from 'react-icons/fi';
import { FaEye, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
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
  
  const getTypeLabel = (type: PublicationType) => {
    const labels = {
      ARTICLE: 'Article',
      CONFERENCE: 'Conférence',
      BOOK_CHAPTER: 'Chapitre',
      THESIS: 'Thèse',
      PATENT: 'Brevet',
      POSTER: 'Poster',
    };
    return labels[type] || 'Publication';
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-xl hover:border-blue-300/50 hover:bg-white transition-all duration-300">
      <Link to={`/publications/${publication.slug}`} className="block p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full shadow-sm border border-blue-100">
            {getTypeLabel(publication.type)}
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <FiCalendar className="w-4 h-4" />
            {publication.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {publication.title}
        </h3>

        {/* Authors */}
        <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
          <FaUsers className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1 leading-relaxed">
            {publication.authors.slice(0, 3).join(', ')}
            {publication.authors.length > 3 && ` +${publication.authors.length - 3}`}
          </span>
        </div>

        {/* Venue */}
        {(publication.journal || publication.conference) && (
          <p className="text-sm text-gray-500 italic mb-4 line-clamp-1 leading-relaxed">
            {publication.journal || publication.conference}
          </p>
        )}

        {/* Abstract preview */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-5 leading-relaxed">
          {publication.abstract}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div className="flex items-center gap-4">
            {publication.citations > 0 && (
              <span className="text-xs text-gray-500 font-medium">
                {publication.citations} citation{publication.citations > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
              Lire plus
            </span>
            <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="px-6 pb-4 flex gap-2 border-t border-gray-100 pt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/publications/${publication.slug}`);
            }}
            className="flex-1"
          >
            <FaEye className="mr-1" />
            Voir
          </Button>
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onEdit();
              }}
              className="flex-1"
            >
              <FaEdit className="mr-1" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <FaTrash className="mr-1" />
              Supprimer
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicationCard;
