import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaClock, FaUsers, FaEdit, FaTrash, FaEye, FaGraduationCap, FaArrowRight, FaListUl } from 'react-icons/fa';
import type { Course } from '../types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface CourseCardProps {
  course: Course;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray';

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEdit, 
  onDelete, 
  isAdmin 
}) => {
  const navigate = useNavigate();

  const getLevelInfo = (level: string) => {
    const info: Record<string, { label: string; gradient: string; color: BadgeVariant }> = {
      LICENCE: { 
        label: 'Licence', 
        gradient: 'from-green-500 via-emerald-600 to-teal-600',
        color: 'blue'
      },
      MASTER: { 
        label: 'Master', 
        gradient: 'from-blue-500 via-blue-600 to-indigo-600',
        color: 'green'
      },
      INGENIEUR: { 
        label: 'Ingénieur', 
        gradient: 'from-yellow-500 via-orange-600 to-red-600',
        color: 'yellow'
      },
      DOCTORAT: { 
        label: 'Doctorat', 
        gradient: 'from-purple-500 via-purple-600 to-pink-600',
        color: 'purple'
      },
    };
    return info[level] || { label: level, gradient: 'from-gray-500 via-gray-600 to-slate-600', color: 'gray' as BadgeVariant };
  };

  const levelInfo = getLevelInfo(course.level);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group"
    >
      {/* Gradient border */}
      <div className={`relative bg-gradient-to-br ${levelInfo.gradient} rounded-2xl p-[2px] shadow-xl hover:shadow-2xl transition-all duration-300`}>
        <div className="bg-white rounded-2xl p-6 h-full">
          {/* Header with level badge and credits */}
          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${levelInfo.gradient} text-white text-sm font-semibold shadow-md`}>
              <FaGraduationCap className="w-4 h-4" />
              <span>{levelInfo.label}</span>
            </div>
            {course.credits && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${levelInfo.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}
              >
                {course.credits}
              </motion.div>
            )}
          </motion.div>

          {/* Title with gradient effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to={`/courses/${course.id}`}
              className={`text-xl font-bold mb-3 line-clamp-2 bg-gradient-to-r ${levelInfo.gradient} bg-clip-text text-transparent hover:scale-[1.02] transition-transform duration-200 block`}
            >
              {course.title}
            </Link>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-sm text-gray-700 mb-4 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {course.description}
          </motion.p>

          {/* Course metadata */}
          <motion.div 
            className="space-y-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {course.hours && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock className="text-blue-500" />
                <span className="font-semibold">{course.hours} heures</span>
              </div>
            )}

            {course.level && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaBook className="text-purple-500" />
                <span className="font-semibold">Niveau {levelInfo.label}</span>
              </div>
            )}

            {course.objectives && course.objectives.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaListUl className="text-green-500" />
                <span className="font-semibold">{course.objectives.length} objectif(s) pédagogique(s)</span>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          {!isAdmin ? (
            <motion.div 
              className="flex items-center justify-between pt-4 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaUsers className="text-orange-500" />
                <span className="font-semibold">Cours interactif</span>
              </div>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate(`/courses/${course.id}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${levelInfo.gradient} text-white text-xs font-semibold shadow-md cursor-pointer`}
              >
                <span>Voir détails</span>
                <FaArrowRight />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex gap-2 pt-4 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/courses/${course.id}`)}
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
            </motion.div>
          )}
        </div>
      </div>

      {/* Decorative corner element */}
      <motion.div
        className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${levelInfo.gradient} rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
};
