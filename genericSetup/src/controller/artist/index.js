'use strict';
import { getSQL } from './../../database/mysql';

const artistController = {};


artistController.getAll = () => {
  // const allQ = 'SELECT * from album';
  // return getSQL(allQ);
  return null;
}

artistController.getArtist = (name) => {
  const artistQ = "SELECT * FROM artist where name = ?";
  return getSQL(artistQ, name);
}

module.exports = {
  artistController
}