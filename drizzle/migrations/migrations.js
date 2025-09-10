// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_melted_medusa.sql';
import m0001 from './0001_silent_nemesis.sql';
import m0002 from './0002_handy_killmonger.sql';
import m0003 from './0003_groovy_nocturne.sql';
import m0004 from './0004_condemned_captain_britain.sql';
import m0005 from './0005_wakeful_maddog.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  