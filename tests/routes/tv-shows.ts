import test from 'ava';
import app from '../../src/app.js';
import {mongo, usersAccounts, tvShowsLists} from '../../src/lib/database.js';
import dayjs from 'dayjs';
import type {TvShowsList} from '../../src/types/database';

const sampleTvShows: TvShowsList[] = [
  {
    show: {
      backdrop_path: '/wvdWb5kTQipdMDqCclC6Y3zr4j3.jpg',
      created_by: [
        {
          id: 123,
          credit_id: '123456',
          name: 'John Doe',
          gender: 2,
          profile_path: '/profile.jpg',
        },
      ],
      episode_run_time: [60, 45],
      first_air_date: '2010-10-31',
      genres: [
        {id: 10765, name: 'Sci-Fi & Fantasy'},
        {id: 10759, name: 'Action & Adventure'},
        {id: 18, name: 'Drama'},
      ],
      homepage: 'https://example.com',
      id: 1402,
      in_production: true,
      languages: ['en', 'es'],
      last_air_date: '2023-04-30',
      last_episode_to_air: {
        air_date: '2023-04-30',
        episode_number: 10,
        id: 123456,
        name: 'Episode 10',
        overview: 'Last episode overview',
        production_code: 'S01E10',
        season_number: 1,
        still_path: '/episode10.jpg',
        vote_average: 9.5,
        vote_count: 100,
      },
      name: 'The Walking Dead',
      next_episode_to_air: null,
      networks: [
        {
          name: 'Network Name',
          id: 789,
          logo_path: '/logo.jpg',
          origin_country: 'US',
        },
      ],
      number_of_episodes: 100,
      number_of_seasons: 5,
      origin_country: ['US'],
      original_language: 'en',
      original_name: 'The Walking Dead',
      overview:
        "Sheriff's deputy Rick Grimes awakens from a coma to find a post-apocalyptic world dominated by flesh-eating zombies. He sets out to find his family and encounters many other survivors along the way.",
      popularity: 1105.186,
      poster_path: '/rqeYMLryjcawh2JeRpCVUDXYM5b.jpg',
      production_companies: [
        {
          id: 456,
          logo_path: '/company.jpg',
          name: 'Production Company',
          origin_country: 'US',
        },
      ],
      seasons: [
        {
          air_date: '2010-10-31',
          episode_count: 10,
          id: 987,
          name: 'Season 1',
          overview: 'Season 1 overview',
          poster_path: '/season1.jpg',
          season_number: 1,
        },
      ],
      status: 'Returning Series',
      tagline: 'Tagline',
      type: 'Scripted',
      vote_average: 8.1,
      vote_count: 12244,
    },
    seasons: [],
    files: [],
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

  // Insert sample TV show data into the database
  await tvShowsLists.insertMany(sampleTvShows);
});

test.after.always(async () => {
  await mongo.db().dropDatabase();
});

test('should return all TV shows with matching query', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/media/tv-shows?query=Walking',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });
  t.is(response.statusCode, 200);

  const tvShows = response.json();
  t.is(tvShows.results.length, 1);
});

test('should return empty TV show results array with non-matching query', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/media/tv-shows?query=NonMatching',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });
  t.is(response.statusCode, 200);

  const tvShows = response.json();
  t.is(tvShows.results.length, 0);
});

test('should return all TV shows without query', async (t) => {
  const response = await app.inject({
    method: 'GET',
    url: '/media/tv-shows',
    headers: {
      'x-api-key': 'adminapikey',
    },
  });
  t.is(response.statusCode, 200);

  const tvShows = response.json();
  t.is(tvShows.results.length, 1);
});
