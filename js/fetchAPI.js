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

async function fetchAnimesByName(name) {
  const variables = {
    search: name,
    page: 1,
    perPage: 5,
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });

  return res.status === 200 ? await res.json() : null;
}

async function fetchAnimesByGenre(genres) {
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

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: query2,
      variables: variables,
    }),
  });

  return res.status === 200 ? await res.json() : null;
}

let genres1 = [];
let genres2 = [];

const form1 = document.getElementById("anime1");
const suggestions1 = document.getElementById("list1");

form1.addEventListener("keyup", async () => {
  const input = form1.value;
  if (input.length === 0) suggestions1.innerHTML = "";

  if (input.length < 1) return;

  const res = await fetchAnimesByName(input);
  const suggestions = res.data.Page.media;

  let html = "";
  let index = 0;
  for (let suggestion of suggestions) {
    if (suggestion.title.romaji.length > 25) {
      suggestion.title.romaji = suggestion.title.romaji.slice(0, 22) + "...";
    }
    html += `<div id="suggestion1-${index}" class="suggestion"><img class="img" src="${suggestion.coverImage.medium}" alt=""><p class="title">${suggestion.title.romaji}</p></div>`;
    index++;
  }
  suggestions1.innerHTML = html;

  index = 0;
  for (let suggestion of suggestions) {
    const sug = document.getElementById("suggestion1-" + index);

    sug.addEventListener("click", function (event) {
      const placeholder1 = document.getElementById("placeholder1");

      genres1 = suggestion.genres;
      placeholder1.innerHTML = `<div class="suggestion"><img src="${suggestion.coverImage.large}" alt=""></div>`;
    });
    index++;
  }
});

const form2 = document.getElementById("anime2");
const suggestions2 = document.getElementById("list2");

form2.addEventListener("keyup", async () => {
  const input = form2.value;
  if (input.length === 0) suggestions2.innerHTML = "";

  if (input.length < 1) return;

  const res = await fetchAnimesByName(input);
  const suggestions = res.data.Page.media;

  let html = "";
  let index = 0;
  for (let suggestion of suggestions) {
    if (suggestion.title.romaji.length > 25) {
      suggestion.title.romaji = suggestion.title.romaji.slice(0, 22) + "...";
    }
    html += `<div id="suggestion2-${index}" class="suggestion"><img class="img" src="${suggestion.coverImage.medium}" alt=""><p class="title">${suggestion.title.romaji}</p></div>`;
    index++;
  }
  suggestions2.innerHTML = html;

  index = 0;
  for (let suggestion of suggestions) {
    const sug = document.getElementById("suggestion2-" + index);

    sug.addEventListener("click", function (event) {
      const placeholder2 = document.getElementById("placeholder2");

      genres2 = suggestion.genres;
      placeholder2.innerHTML = `<div class="suggestion"><img  src="${suggestion.coverImage.large}" alt=""></div>`;
    });
    index++;
  }
});

const button = document.getElementById("check");
button.addEventListener("click", async (event) => {
  if (genres1.length === 0 || genres2.length === 0)
    return alert("Merci de sélectionner deux animés");

  const commonGenres = genres1.filter((genre) => genres2.includes(genre));
  if (commonGenres.length === 0) return alert("Aucun genre commun");

  const res = await fetchAnimesByGenre(commonGenres);
  const suggestions = res.data.Page.media;
  suggestions.sort((a,b) => b.seasonYear - a.seasonYear);

  let html = "";
  const matches = document.getElementById("match");
  for (let suggestion of suggestions) {
    html += `<div class="common"><img  src="${suggestion.coverImage.large}" alt=""><p>${suggestion.title.romaji}</p></div>`;
  }

  matches.innerHTML = html;

  suggestions1.innerHTML = '';
  suggestions2.innerHTML = '';
});
