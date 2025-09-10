CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  recommendation INTEGER,
  summary TEXT,
  isbn VARCHAR(17)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_of_category TEXT,
  book_id INTEGER NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE my_opinion (
  id SERIAL PRIMARY KEY,
  personal_opinion TEXT,
  book_id INTEGER NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  quote TEXT,
  book_id INTEGER NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id)
);
