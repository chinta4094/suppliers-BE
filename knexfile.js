// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: "suppliers",
      user: "postgres",
      password: "bhaskar18"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host : 'ec2-54-208-139-247.compute-1.amazonaws.com',
      database : 'd474rruip86dd1',
      user : 'dyiyiejhbmffwu',
      port : 5432,
      password : '91aa3a2e0d4d3c8ea97e416ee39a9f5ad2472a2b669d4c6ce7048732f0e36af8',
      URL : 'dyiyiejhbmffwu:91aa3a2e0d4d3c8ea97e416ee39a9f5ad2472a2b669d4c6ce7048732f0e36af8@ec2-54-208-139-247.compute-1.amazonaws.com:5432/d474rruip86dd1',
      CLI : 'heroku pg:psql postgresql-encircled-98028 --app srinivasa-suppliers',
      ssl : true
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
