require('dotenv').config();

const databaseProvider = require('./app/providers/database');

const cron = require('node-cron');

const sampleCronFunc = () => {
  const usersQuery = databaseProvider
    .knex('users')
    .select('id');

  return databaseProvider.executeQuery(usersQuery);
};

console.log('cron started');

if (process.env.CRON_VALUE) {
  cron.schedule(process.env.CRON_VALUE, () => {
    console.log('Sample cron function calling');
    sampleCronFunc()
    .then((res) => console.log(res.rows))
    .then(() => {
      console.log('Sample cron function executed');
    })
    .catch((error) => {
      console.log(error)
    });
  });
} else {
  console.log('Sample cron function runnig wihout cron value.');
  sampleCronFunc()
    .then((res) => console.log(res.rows))
    .then(() => {
      console.log('Sample cron function executed without cron value.');
    })
    .catch((error) => {
      console.log(error)
    });
}

