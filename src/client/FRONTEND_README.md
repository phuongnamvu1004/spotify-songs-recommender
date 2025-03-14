### When posting user preferences from the survey
- Save the preferences into a JSON of this schema
```ts
interface Preferences {
  artists: string[];
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
    artists: ['artist1', 'artist2', 'other'], // Artists name in survey + 'other' option
    acousticness: boolean // True or False
    year: { start: 1960, end: 2020 }, // min: 1960, max: 2020
    duration: { start: 120, end: 300 }, // min: 60s, max: 420s
    tempo: { start: 80, end: 140 } // min: 60, max: 150
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