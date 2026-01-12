import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaBook, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import type { Course } from '../types';
import Button from './ui/Button';

interface CourseCardProps {
  course: Course;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEdit, 
  onDelete, 
  isAdmin 
}) => {
  const navigate = useNavigate();

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      LICENCE: 'Licence',
      MASTER: 'Master',
      INGENIEUR: 'Ingénieur',
      DOCTORAT: 'Doctorat',
    };
    return labels[level] || level;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'LICENCE':
        return 'text-green-700 bg-green-50';
      case 'MASTER':
        return 'text-blue-700 bg-blue-50';
      case 'INGENIEUR':
        return 'text-purple-700 bg-purple-50';
      case 'DOCTORAT':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:shadow-xl hover:border-blue-300/50 hover:bg-white transition-all duration-300">
      <Link to={`/courses/${course.id}`} className="block p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {course.code && (
            <span className="text-xs font-mono text-gray-500 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200/60">
              {course.code}
            </span>
          )}
          <span className={`px-4 py-1.5 text-xs font-semibold rounded-full shadow-sm border border-current/10 ${getLevelColor(course.level)}`}>
            {getLevelLabel(course.level)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-5 border-b border-gray-100">
          {course.hours && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <FaClock className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">{course.hours}h</span>
            </div>
          )}
          {course.credits && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <FaBook className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium">{course.credits} crédits</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
            Voir le cours
          </span>
          <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
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
              navigate(`/courses/${course.id}`);
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
