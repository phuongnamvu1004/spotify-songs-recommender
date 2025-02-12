export function filterByPreferences(data, preferences) {
  return data.filter((item) => {
    return (
      (!preferences.artists || preferences.artists.includes(item.artist_name)) &&
      (!preferences.genres || preferences.genres.includes(item.genre)) &&
      (!preferences.year || (preferences.year.start <= item.year && item.year <= preferences.year.end)) &&
      (!preferences.duration || (preferences.duration.start <= item.duration_ms && item.duration_ms <= preferences.duration.end)) &&
      (!preferences.tempo || (preferences.tempo.start <= item.tempo && item.tempo <= preferences.tempo.end))
    );
  });
}
