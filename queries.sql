-- queries.sql
CREATE TABLE  events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  task TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL
);
INSERT INTO events (title, task, date, time)
VALUES ('Wash', 'Wash clothes and plates', '2025-06-05', '19:43'), 
      VALUES ('Departmental', 'Colloqium', '2025-06-03', '20:22');

