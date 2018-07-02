CREATE DATABASE music; 
use music; 

CREATE TABLE artist (
  name text not null,
  id int, 
  CONSTRAINT ArtistPK Primary Key(id)
);

SHOW WARNINGS;

CREATE TABLE album (
  name text not null,  
  artist_id int not null, 
  id int not null,
  CONSTRAINT AlbumPK PRIMARY KEY(id, artist_id),
  CONSTRAINT ArtistFK FOREIGN KEY(artist_id) REFERENCES artist(id)
);

SHOW WARNINGS;

CREATE TABLE song ( 
  track_number int not null, 
  name text not null,
  artist_id int not null, 
  album_id int not null, 
  lyrics text not null,
  CONSTRAINT SongPK PRIMARY KEY(track_number, artist_id, album_id), 
  CONSTRAINT ArtAlbFK FOREIGN KEY(artist_id, album_id) REFERENCES album(artist_id, id)
);

SHOW WARNINGS;