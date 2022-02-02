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
      host : 'ec2-34-233-157-189.compute-1.amazonaws.com',
      database : 'dcn3d28dvc9n9t',
      user : 'msnosihfmelukl',
      port : 5432,
      password : '64d2ce1832e2984c180f00f0ab2cd30272fdd634e7055c7c4e6064e3c8e0b143',
      URL : 'msnosihfmelukl:64d2ce1832e2984c180f00f0ab2cd30272fdd634e7055c7c4e6064e3c8e0b143@ec2-34-233-157-189.compute-1.amazonaws.com:5432/dcn3d28dvc9n9t',
      CLI : 'heroku pg:psql postgresql-concave-39684 --app srinivasa-suppliers',
      ssl : { rejectUnauthorized: false }
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
