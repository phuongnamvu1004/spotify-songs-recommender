/**
 * Format song duration from milliseconds to MM:SS format
 */
export function formatDuration(ms) {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Estimate playlist duration based on track count
 */
export function formatPlaylistDuration(playlist) {
  if (!playlist || !playlist.tracks) return "0 min";
  // Estimate based on average track length (3:30)
  const estimatedMinutes = Math.round((playlist.tracks.total || 0) * 3.5);
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
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format an array of artists to string
 */
export function formatArtists(artists) {
  if (!artists || !Array.isArray(artists)) return "Unknown Artist";

  return artists
    .map((artist) => artist.name || "")
    .filter((name) => name)
    .join(", ");
}

/**
 * Clean artist name from weird formatting
 */
export function cleanArtistDisplay(artistString) {
  if (!artistString) return "Unknown Artist";

  if (typeof artistString === "string") {
    return artistString
      .replace(/\[|\]|'|"|\\|\//g, "")
      .replace(/^\s+|\s+$/g, "");
  }

  return artistString;
}

export function formatSongToTrack(song) {
  return {
    id: song.id,
    name: song.name,
    artists: Array.isArray(song.artists)
      ? song.artists.map((artist) =>
          typeof artist === "string"
            ? { name: cleanArtistDisplay(artist) }
            : artist
        )
      : [{ name: cleanArtistDisplay(song.artists || "Unknown Artist") }],
    album: {
      name: song.album || "Unknown Album",
      images: song.imgURL ? [{ url: song.imgURL }] : null,
    },
    duration_ms: song.duration_ms,
    preview_url: song.preview_url,
    popularity: song.popularity || 0,
  };
}

export function formatArtistDuration(artist) {
  const totalMs = artist.songs.reduce(
    (sum, song) => sum + (song.duration_ms || 0),
    0
  );
  const minutes = Math.floor(totalMs / 60000);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours} hr ${remainingMins} min`;
}
