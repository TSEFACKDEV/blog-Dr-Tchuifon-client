import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendar, FaGraduationCap, FaCheckCircle, FaClock, FaSpinner, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import type { Supervision } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface SupervisionCardProps {
  supervision: Supervision;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray';

const levelColors: Record<string, BadgeVariant> = {
  LICENCE: 'blue',
  MASTER: 'green',
  DOCTORAT: 'purple',
};

const statusColors: Record<string, BadgeVariant> = {
  EN_COURS: 'blue',
  SOUTENU: 'green',
  ABANDONNE: 'red',
};

const statusLabels: Record<string, string> = {
  EN_COURS: 'En cours',
  SOUTENU: 'Soutenu',
  ABANDONNE: 'Abandonné',
};

const statusIcons: Record<string, React.ReactNode> = {
  EN_COURS: <FaSpinner className="animate-spin" />,
  SOUTENU: <FaCheckCircle />,
  ABANDONNE: <FaClock />,
};

export const SupervisionCard: React.FC<SupervisionCardProps> = ({ 
  supervision, 
  onEdit, 
  onDelete, 
  isAdmin 
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <Badge variant={(levelColors[supervision.level] || 'blue') as BadgeVariant}>
          {supervision.level}
        </Badge>
        <div className="flex items-center gap-1">
          {statusIcons[supervision.status]}
          <Badge variant={(statusColors[supervision.status] || 'blue') as BadgeVariant}>
            {statusLabels[supervision.status]}
          </Badge>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{supervision.topic}</h3>

      {supervision.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supervision.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <FaUser className="mr-2 text-gray-400" />
          <span className="font-medium">{supervision.studentName}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FaGraduationCap className="mr-2 text-gray-400" />
          <span>{supervision.level}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <FaCalendar className="mr-2 text-gray-400" />
            <span>{new Date(supervision.startDate).getFullYear()}</span>
          </div>
          {supervision.endDate && (
            <span className="text-gray-500">
              → {new Date(supervision.endDate).getFullYear()}
            </span>
          )}
        </div>
      </div>

      {supervision.publications && supervision.publications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{supervision.publications.length}</span> publication(s) associée(s)
          </p>
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && (onEdit || onDelete) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/supervisions/${supervision.id}`)}
            className="flex-1"
          >
            <FaEye className="mr-1" />
            Voir
          </Button>
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
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
              onClick={onDelete}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <FaTrash className="mr-1" />
              Supprimer
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
