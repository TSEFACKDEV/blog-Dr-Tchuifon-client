import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { getAllCourses } from '../store/cours/actions';
import { MainLayout } from '../layouts/MainLayout';
import { FaGraduationCap, FaSearch, FaClock, FaBook } from 'react-icons/fa';
import Spinner from '../components/ui/Spinner';
import { CourseCard } from '../components/CourseCard';

const courseLevels = [
  { value: 'all', label: 'Tous les niveaux' },
  { value: 'LICENCE', label: 'Licence' },
  { value: 'MASTER', label: 'Master' },
  { value: 'INGENIEUR', label: 'Ingénieur' },
  { value: 'DOCTORAT', label: 'Doctorat' },
];

export const CoursesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    dispatch(getAllCourses({}));
  }, [dispatch]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.code && course.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel && course.isActive;
  });

  if (loading && courses.length === 0) {
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaGraduationCap className="text-3xl text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Cours & Enseignements
              </h1>
            </div>
            <p className="text-gray-600 max-w-3xl">
              Explorez les différents cours que j'enseigne, couvrant divers domaines de 
              la Chimie-Physique et du Génie des Procédés, de la licence au doctorat.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {courses.filter(c => c.isActive).length}
                </span>
                <span className="text-gray-600">cours actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {courses.reduce((sum, course) => sum + (course.hours || 0), 0)}
                </span>
                <span className="text-gray-600">heures totales</span>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recherche */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Niveau filter */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {courseLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grille de cours */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <FaBook className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500 mb-2">Aucun cours trouvé</p>
                <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
