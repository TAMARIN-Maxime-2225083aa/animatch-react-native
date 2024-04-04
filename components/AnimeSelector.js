import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity } from 'react-native';

const query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    media (id: $id, search: $search, type: ANIME) {
      id
      title {
        romaji
        native
        english
      }
      coverImage { extraLarge large medium }
      genres
    }
  }
}
`;

const url = "https://graphql.anilist.co";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const fetchAnimesByGenre = async (genres) => {
  const variables = {
    page: 1,
    perPage: 50,
    genre_in: genres,
  };

  const query2 = `
  query ($id: Int, $page: Int, $perPage: Int, $genre_in: [String]) {
    Page (page: $page, perPage: $perPage) {
      media (id: $id, type: ANIME, genre_in: $genre_in) {
        id
        title {
          romaji
          native
          english
        }
        seasonYear
        coverImage { extraLarge large medium }
        genres
      }
    }
  }
  `;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: query2,
        variables: variables,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching matched anime:", error);
    return null;
  }
};

const AnimeSelector = () => {
  const [anime1, setAnime1] = useState('');
  const [anime2, setAnime2] = useState('');
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [genres1, setGenres1] = useState([]);
  const [genres2, setGenres2] = useState([]);
  const [placeholder1, setPlaceholder1] = useState('https://via.placeholder.com/150');
  const [placeholder2, setPlaceholder2] = useState('https://via.placeholder.com/150');
  const [matchedAnime, setMatchedAnime] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchAnimesByName = async (input, setSuggestions) => {
    if (input.length < 1) {
      setSuggestions([]);
      return;
    }

    const variables = {
      search: input,
      page: 1,
      perPage: 5,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setSuggestions(data.data.Page.media);
        updateSearchHistory(input); // Mettre à jour l'historique de recherche
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching animes:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = async (input, setAnime, setSuggestions) => {
    setAnime(input);
    await fetchAnimesByName(input, setSuggestions);
  };

  const handleSuggestionClick = (suggestion, setGenres, setAnime, setPlaceholder, setSuggestions) => {
    setGenres(suggestion.genres);
    setAnime(suggestion.title.romaji);
    setPlaceholder(suggestion.coverImage.large);
    setSuggestions([]); // Fermer la liste des suggestions en la vidant
  };

  const renderSuggestions = (suggestions, setGenres, setAnime, setPlaceholder, setSuggestions) => {
    return suggestions.map((suggestion, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleSuggestionClick(suggestion, setGenres, setAnime, setPlaceholder, setSuggestions)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: suggestion.coverImage.medium }}
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          <Text>{suggestion.title.romaji}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  const handleMatch = async () => {
  // Réinitialisation des champs de saisie et des suggestions
  setAnime1('');
  setAnime2('');
  setSuggestions1([]);
  setSuggestions2([]);

  if (genres1.length === 0 || genres2.length === 0) {
    alert("Merci de sélectionner deux animés");
    return;
  }

  const commonGenres = [];

  // Trouver les genres communs entre les deux listes de genres
  genres1.forEach(genre => {
    if (genres2.includes(genre)) {
      commonGenres.push(genre);
    }
  });

  if (commonGenres.length === 0) {
    alert("Aucun genre commun");
    return;
  }

  try {
    const res = await fetchAnimesByGenre(commonGenres);
    const suggestions = res.data.Page.media;

    if (suggestions.length === 0) {
      alert("Aucun anime trouvé pour les genres communs sélectionnés");
      return;
    }

    suggestions.sort((a, b) => b.seasonYear - a.seasonYear);
    setMatchedAnime(suggestions[0]);
    setCurrentIndex(0);
  } catch (error) {
    console.error("Error fetching matched anime:", error);
    alert("Une erreur s'est produite lors de la recherche de l'anime correspondant");
  }
};

const handleNextAnime = () => {
  if (currentIndex < suggestions.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    alert("Aucun autre anime suivant dans la liste des suggestions");
  }
};

const renderSearchHistory = () => {
  return searchHistory.map((anime, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleInputChange(anime, setAnime1, setSuggestions1)}
    >
      <Text>{anime}</Text>
    </TouchableOpacity>
  ));
};

return (
  <View style={{ padding: 40 }}>
    {/* Champ de saisie 1 et suggestions */}
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      onChangeText={(text) => handleInputChange(text, setAnime1, setSuggestions1)}
      value={anime1}
      placeholder="Donnez un nom d'anime"
    />
    <View>
      {renderSuggestions(suggestions1, setGenres1, setAnime1, setPlaceholder1, setSuggestions1)}
    </View>

    {/* Champ de saisie 2 et suggestions */}
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, marginTop: 20 }}
      onChangeText={(text) => handleInputChange(text, setAnime2, setSuggestions2)}
      value={anime2}
      placeholder="Donnez un nom d'anime"
    />
    <View>
      {renderSuggestions(suggestions2, setGenres2, setAnime2, setPlaceholder2, setSuggestions2)}
    </View>

    {/* Placeholders des animes sélectionnés */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
      <Image source={{ uri: placeholder1 }} style={{ width: 150, height: 150 }} />
      <Image source={{ uri: placeholder2 }} style={{ width: 150, height: 150 }} />
    </View>

    {/* Bouton de correspondance */}
    <Button title="Match" onPress={handleMatch} />

    {/* Historique de recherche */}
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>Historique de recherche</Text>
      {renderSearchHistory()}
    </View>

    {/* Affichage de l'anime correspondant */}
    {matchedAnime && (
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Anime correspondant :</Text>
        <Image source={{ uri: suggestions[currentIndex].coverImage.large }} style={{ width: 150, height: 150 }} />
        <Text>{suggestions[currentIndex].title.romaji}</Text>
        <Button title="Suivant" onPress={handleNextAnime} />
      </View>
    )}
  </View>
);
};

export default AnimeSelector;