import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaBuilding, FaGlobe, FaLink, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import type { Collaborator } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface CollaboratorCardProps {
  collaborator: Collaborator;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ 
  collaborator, 
  onEdit, 
  onDelete, 
  isAdmin 
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <div
        onClick={() => navigate(`/collaborators/${collaborator.id}`)}
        className="cursor-pointer"
      >
        <div className="flex items-start gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          {collaborator.photoUrl ? (
            <img
              src={collaborator.photoUrl}
              alt={collaborator.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {collaborator.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{collaborator.name}</h3>
          
          <div className="space-y-2">
            {collaborator.institution && (
              <div className="flex items-center text-sm text-gray-600">
                <FaBuilding className="mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate">{collaborator.institution}</span>
              </div>
            )}

            {collaborator.country && (
              <div className="flex items-center text-sm text-gray-600">
                <FaGlobe className="mr-2 text-gray-400 flex-shrink-0" />
                <span>{collaborator.country}</span>
              </div>
            )}

            {collaborator.email && (
              <div className="flex items-center text-sm text-gray-600">
                <FaEnvelope className="mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${collaborator.email}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline truncate"
                >
                  {collaborator.email}
                </a>
              </div>
            )}

            {collaborator.website && (
              <div className="flex items-center text-sm text-gray-600">
                <FaLink className="mr-2 text-gray-400 flex-shrink-0" />
                <a
                  href={collaborator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline truncate"
                >
                  Site web
                </a>
              </div>
            )}
          </div>

          {/* Publications */}
          {collaborator.publications && collaborator.publications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{collaborator.publications.length}</span>{' '}
                publication(s) en collaboration
              </p>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (onEdit || onDelete) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/collaborators/${collaborator.id}`)}
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
