'use strict';
import { getSQL } from './../../database/mysql';

const songController = {};


/**
 * Expensive
*/
songController.getAll = () => {
  const allQ = `
  select art.name, alb.name, song.name, song.track_number 
  from artist art, album alb, song
  where 
  art.id = alb.artist_id and 
  art.id = song.artist_id`;
  return getSQL(allQ);
}

// songController.getArtist = (name) => {
//   const artistQ = "SELECT * FROM artist where name = ?";
//   return getSQL(artistQ, name);
// }

module.exports = {
  songController
}