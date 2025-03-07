### When posting user preferences from the survey
- Save the preferences into a JSON of this schema
```ts
interface Preferences {
  artists: string[];
  genres: string[];
  year: {
    start: number;
    end: number;
  };
  duration: {
    start: number;
    end: number;
  };
  energyLevel: {
    start: number;
    end: number;
  };
  tempo: {
    start: number;
    end: number;
  };
}
``` 
- Then make this call in to the saved preferences data
```js
async function savePreferences() {
  const preferences = {
    artists: ['artist1', 'artist2'],
    genres: ['pop', 'rock'],
    year: { start: 1990, end: 2020 },
    duration: { start: 120, end: 300 },
    energyLevel: { start: 0.3, end: 0.8 },
    tempo: { start: 80, end: 140 }
  };
  
  try {
    const response = await fetch('/api/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferences)
    });
    
    const data = await response.json();
    console.log('Preferences saved:', data);
    
    // Then you can redirect or fetch recommendations
    // window.location.href = '/recommendations';
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}
```