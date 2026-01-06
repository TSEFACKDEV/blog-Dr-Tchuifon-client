/**
 * Utilitaires pour les URLs et images
 */

/**
 * Construit l'URL complète pour une image uploadée
 * @param relativePath - Le chemin relatif retourné par le backend (ex: "uploads/profiles/photo.jpg")
 * @returns L'URL complète (ex: "http://localhost:3001/uploads/profiles/photo.jpg")
 */
export const getImageUrl = (relativePath: string | undefined | null): string | null => {
  if (!relativePath) return null;
  
  // Si c'est déjà une URL complète, la retourner
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Construire l'URL complète en gérant les slashes
  const baseUrl = (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001').replace(/\/$/, '');
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Génère une URL d'avatar par défaut basée sur le nom
 * @param name - Le nom de la personne
 * @returns URL de l'avatar généré
 */
export const getDefaultAvatar = (name: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=256&background=random&bold=true`;
};

/**
 * Génère les initiales à partir d'un nom
 * @param name - Le nom complet
 * @returns Les initiales (max 2 caractères)
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Formate une date en français
 * @param date - La date à formater
 * @returns La date formatée
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formate une date relative (il y a X jours)
 * @param date - La date à formater
 * @returns La date relative
 */
export const formatRelativeDate = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
};

/**
 * Tronque un texte à une longueur maximale
 * @param text - Le texte à tronquer
 * @param maxLength - La longueur maximale
 * @returns Le texte tronqué avec "..."
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
