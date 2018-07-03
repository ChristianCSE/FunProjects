'use strict';
import { getSQL } from './../../database/mysql';

const artistController = {};


artistController.getAll = () => {
  const allQ = "SELECT * FROM artist";
  return getSQL(allQ);
}

artistController.getArtist = (name) => {
  const artistQ = "SELECT * FROM artist where name = ?";
  return getSQL(artistQ, name);
}

module.exports = {
  artistController
}