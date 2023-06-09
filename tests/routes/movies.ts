import test from 'ava';
import app from '../../src/app.js';
import {mongo, usersAccounts, moviesLists} from '../../src/lib/database.js';
import dayjs from 'dayjs';
import type {MovieList} from '../../src/types/database';

const sampleMovies: MovieList[] = [
  {
    tmdb: {
      adult: false,
      backdrop_path: '/w7RDIgQM6bLT7JXtH4iUQd3Iwxm.jpg',
      belongs_to_collection: null,
      budget: 63000000,
      genres: [
        {id: 18, name: 'Drama'},
        {id: 80, name: 'Crime'},
      ],
      homepage: '',
      id: 278,
      imdb_id: 'tt0111161',
      original_language: 'en',
      original_title: 'The Shawshank Redemption',
      overview:
        'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
      popularity: 69.506,
      poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      production_companies: [
        {
          id: 97,
          logo_path: '/7znWcbDd4PcJzJUlJxYqAlPPykp.png',
          name: 'Castle Rock Entertainment',
          origin_country: 'US',
        },
      ],
      production_countries: [{iso_3166_1: 'US', name: 'United States of America'}],
      release_date: '1994-09-23',
      revenue: 28341469,
      runtime: 142,
      spoken_languages: [{english_name: 'English', iso_639_1: 'en', name: 'English'}],
      status: 'Released',
      tagline: 'Fear can hold you prisoner. Hope can set you free.',
      title: 'The Shawshank Redemption',
      video: false,
      vote_average: 8.7,
      vote_count: 20114,
    },
    files: ['The Shawshank Redemption.mkv'],
  },
];

test.before(async () => {
  // Create an admin user to use in the tests
  await usersAccounts.insertOne({
    displayname: 'Admin User',
    username: 'admin',
    password: 'password',
    api_key: 'adminapikey',
    role: 'admin',
    created_at: dayjs().toISOString(),
    last_seen_at: dayjs().toISOString(),
    current_status: 'active',
    sex: 'unknown',
  });

  // Insert sample movie data into the database
  await moviesLists.insertMany(sampleMovies);
});

test.after.always(async () => {
  await mongo.db().dropDatabase();
});

test('should return all movies with matching query', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/media/movies?query=Redemption',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });
  t.is(response.statusCode, 200);

  const movies = response.json();
  t.is(movies.results.length, 1);
});

test('should return empty movie results array with non-matching query', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/media/movies?query=NonMatching',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });
  t.is(response.statusCode, 200);

  const movies = response.json();
  t.is(movies.results.length, 0);
});

test('should return all movies without query', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/media/movies',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });
  t.is(response.statusCode, 200);

  const movies = response.json();
  t.is(movies.results.length, 1);
});
