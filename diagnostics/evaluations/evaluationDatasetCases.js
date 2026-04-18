export default [
  {
    log: "ERROR 500: the database connection timeout after 30s",
    expected: "Database timeout likely due to slow query or connection pool exhaustion",
  },
];
