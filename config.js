var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pixlee';

module.exports = connectionString;