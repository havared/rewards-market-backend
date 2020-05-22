module.exports = {
  HOST: 'database-2.c6nxihp6b4sp.us-east-2.rds.amazonaws.com',
  USER: 'admin',
  PASSWORD: '87654321',
  DB: 'rewards',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
