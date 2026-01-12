import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getCourseById } from '../store/cours/actions';
import { MainLayout } from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { FaArrowLeft, FaBook, FaClock, FaCalendar, FaGraduationCap, FaListUl, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    if (id) {
      dispatch(getCourseById(id));
    }
  }, [dispatch, id]);

  if (loading || !currentCourse) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const getLevelInfo = (level: string) => {
    const info: Record<string, { label: string; color: string; bgColor: string }> = {
      LICENCE: { 
        label: 'Licence', 
        color: 'text-green-700',
        bgColor: 'bg-green-50'
      },
      MASTER: { 
        label: 'Master', 
        color: 'text-blue-700',
        bgColor: 'bg-blue-50'
      },
      INGENIEUR: { 
        label: 'Ingénieur', 
        color: 'text-orange-700',
        bgColor: 'bg-orange-50'
      },
      DOCTORAT: { 
        label: 'Doctorat', 
        color: 'text-purple-700',
        bgColor: 'bg-purple-50'
      },
    };
    return info[level] || { label: level, color: 'text-gray-700', bgColor: 'bg-gray-50' };
  };

  const levelInfo = getLevelInfo(currentCourse.level);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <button
            onClick={() => navigate('/courses')}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Retour aux cours</span>
          </button>

          {/* En-tête */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8 sm:p-10 mb-6 sm:mb-8 hover:shadow-md transition-shadow duration-300">
            {/* Badge niveau et code */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${levelInfo.bgColor} ${levelInfo.color} text-sm font-semibold shadow-sm border border-current/10`}>
                <FaGraduationCap className="w-4 h-4" />
                {levelInfo.label}
              </span>
              {currentCourse.code && (
                <span className="px-3 py-1.5 bg-gray-50 text-gray-700 font-mono text-xs rounded-lg border border-gray-200">
                  {currentCourse.code}
                </span>
              )}
            </div>
            
            {/* Titre */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8 break-words leading-tight">
              {currentCourse.title}
            </h1>

            {/* Métadonnées en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {currentCourse.credits && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200/50 hover:border-blue-300/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <FaBook className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Crédits</p>
                    <p className="text-lg font-bold text-gray-900">{currentCourse.credits}</p>
                  </div>
                </div>
              )}
              {currentCourse.hours && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/30 border border-green-200/50 hover:border-green-300/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
                    <FaClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Durée</p>
                    <p className="text-lg font-bold text-gray-900">{currentCourse.hours}h</p>
                  </div>
                </div>
              )}
              {currentCourse.semester && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-200/50 hover:border-purple-300/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <FaCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Semestre</p>
                    <p className="text-lg font-bold text-gray-900">S{currentCourse.semester}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {currentCourse.description && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8 sm:p-10 mb-6 sm:mb-8 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-200/60">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                  <FaBook className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Description
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words text-base sm:text-lg">
                {currentCourse.description}
              </p>
            </div>
          )}

          {/* Objectifs */}
          {currentCourse.objectives && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8 sm:p-10 mb-6 sm:mb-8 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-200/60">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
                  <FaListUl className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Objectifs du cours
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words text-lg">
                {currentCourse.objectives}
              </div>
            </div>
          )}

          {/* Syllabus */}
          {currentCourse.syllabus && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-8 sm:p-10 mb-6 sm:mb-8 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-200/60">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <FaListUl className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Contenu du cours
                </h2>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words text-lg">
                {currentCourse.syllabus}
              </div>
            </div>
          )}

          {/* Statut */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-sm border p-6 sm:p-8 transition-all duration-300 ${
            currentCourse.isActive 
              ? 'bg-gradient-to-br from-green-50/50 via-white/80 to-white/80 border-green-200/60 hover:border-green-300/60' 
              : 'bg-white/80 border-gray-200/50 hover:shadow-md'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl shadow-md flex items-center justify-center transition-all duration-300 ${
                  currentCourse.isActive
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {currentCourse.isActive ? <FaCheckCircle className="w-6 h-6" /> : <FaTimesCircle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Statut du cours</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {currentCourse.isActive ? 'Cours actif' : 'Cours inactif'}
                  </p>
                </div>
              </div>
              <span className={`px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                currentCourse.isActive
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
                {currentCourse.isActive ? 'Actif' : 'Inactif'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetailsPage;
