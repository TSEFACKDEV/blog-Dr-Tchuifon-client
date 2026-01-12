import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendar, FaGraduationCap, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import type { Supervision } from '../types';
import Button from './ui/Button';

interface SupervisionCardProps {
  supervision: Supervision;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const getLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    LICENCE: 'Licence',
    MASTER: 'Master',
    DOCTORAT: 'Doctorat',
    POSTDOC: 'Post-doctorat',
  };
  return labels[level] || level;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    SUSPENDED: 'Suspendu',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'text-blue-700 bg-blue-50';
    case 'COMPLETED':
      return 'text-green-700 bg-green-50';
    case 'SUSPENDED':
      return 'text-orange-700 bg-orange-50';
    default:
      return 'text-gray-700 bg-gray-50';
  }
};

export const SupervisionCard: React.FC<SupervisionCardProps> = ({ 
  supervision, 
  onEdit, 
  onDelete, 
  isAdmin 
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
      <div
        onClick={() => navigate(`/supervisions/${supervision.id}`)}
        className="cursor-pointer p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-full">
            {getLevelLabel(supervision.level)}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(supervision.status)}`}>
            {getStatusLabel(supervision.status)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          {supervision.topic}
        </h3>

        {/* Student */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <FaUser className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{supervision.studentName}</span>
        </div>

        {/* Description */}
        {supervision.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supervision.description}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FaCalendar className="w-4 h-4" />
            <span>{new Date(supervision.startDate).getFullYear()}</span>
            {supervision.endDate && (
              <span> - {new Date(supervision.endDate).getFullYear()}</span>
            )}
          </div>
          <span className="text-blue-600 font-medium">Voir détails →</span>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="px-6 pb-4 flex gap-2 border-t border-gray-100 pt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/supervisions/${supervision.id}`);
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
                e.stopPropagation();
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
                e.stopPropagation();
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
