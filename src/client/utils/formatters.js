/**
 * Format song duration from milliseconds to MM:SS format
 */
export function formatDuration(ms) {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  /**
   * Estimate playlist duration based on track count
   */
  export function formatPlaylistDuration(trackCount) {
    // Estimate based on average track length (3:30)
    const estimatedMinutes = Math.round(trackCount * 3.5);
    if (estimatedMinutes < 60) {
      return `${estimatedMinutes} min`;
    }
    const hours = Math.floor(estimatedMinutes / 60);
    const minutes = estimatedMinutes % 60;
    return `${hours} hr ${minutes} min`;
  }
  
  /**
   * Format release date
   */
  export function formatReleaseDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  
  /**
   * Format an array of artists to string
   */
  export function formatArtists(artists) {
    if (!artists || !Array.isArray(artists)) return 'Unknown Artist';
    
    return artists
      .map(artist => artist.name || '')
      .filter(name => name)
      .join(', ');
  }
  
  /**
   * Clean artist name from weird formatting
   */
  export function cleanArtistDisplay(artistString) {
    if (!artistString) return 'Unknown Artist';
  
    if (typeof artistString === 'string') {
      return artistString
        .replace(/\[|\]|'|"|\\|\//g, '')
        .replace(/^\s+|\s+$/g, '');
    }
  
    return artistString;
  }
  
  export default {
    formatDuration,
    formatPlaylistDuration,
    formatReleaseDate,
    formatArtists,
    cleanArtistDisplay
  };