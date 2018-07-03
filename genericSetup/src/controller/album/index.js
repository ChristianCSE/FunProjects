'use strict';
import { getSQL } from './../../database/mysql';
import { artistController } from '../artist/';

const albumController = {};


albumController.getAll = () => {
  const allQ = 'SELECT * from album';
  return getSQL(allQ);
}

albumController.getByArtist = (artistName) => {
  //get artist
  return artistController.getArtist(artistName)
  .then(artist => {
    //multiple artist may have the same name
    const getBySingleArtist = 'SELECT * FROM album where artist_id=?';
    console.log(artist);
    artist = artist.map((row) => getSQL(getBySingleArtist, row.id));
    console.log(artist);
    return Promise.all(artist);
  }).catch(err => {
    console.log('albumCx.getByArtist: ', err);
    throw Error('albumCx.getByArtist: ', err);
  })
}




module.exports = {
  albumController
}