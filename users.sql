-- Table: users

-- DROP TABLE users;

CREATE TABLE users
(
  id serial NOT NULL,
  username character varying(20) NOT NULL,
  password character varying(64) NOT NULL,
  salt character varying(32) NOT NULL,
  joindate timestamp with time zone,
  CONSTRAINT users_pk PRIMARY KEY (id),
  CONSTRAINT users_uq_username UNIQUE (username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;
GRANT ALL ON TABLE users TO postgres;
