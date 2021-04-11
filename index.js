require('dotenv').config({ path: './.env' });

const databaseProvider = require('./app/providers/database');

const sqsService = require('./app/services/sqsSendMessage');

const cron = require('node-cron');

const Promise = require('bluebird');

const limit = 1;
const offset = 0;

/*const getCompanies = (limit, offset) => new Promise((resolve, reject) => {
  
  const companyQuery = databaseProvider
    .knex('companies')
    .select('id')
    .limit(limit)
    .offset(offset);

  return resolve(databaseProvider.executeQuery(companyQuery));  
  
});

async function sendRemindersToCompanies() {
  let fetchCompany = await getCompanies(limit, offset);
  console.log('quote>>>', fetchCompany.rows);
  if (fetchCompany.rows && fetchCompany.rows.length > 0) {
    offset = limit
    limit = limit + 1
  }
}*/

const getCompanies = () => {
  const companyQuery = databaseProvider
    .knex('companies')
    .select('id')
    .limit(limit)
    .offset(offset);

  return databaseProvider.executeQuery(companyQuery);
};

console.log('cron started');

if (process.env.CRON_VALUE) {
  // cron.schedule(process.env.CRON_VALUE, () => {
  //   getCompanies()
  //     .then((res) => console.log(res.rows))
  //     .then(() => {
  //       console.log('cron executed');
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     });
  // });
} else {
  console.log('cron runnig wihout cron value.');
  
  //sendRemindersToCompanies();
  // let companies =  getCompanies(limit, offset)
  // console.log('companies>>>' ,companies);
  // sendRemindersToCompanies().then( async (res) => {
  //   console.log('cron executed without cron value.', JSON.stringify(res.rows));
  // })

  getCompanies()
    .then(async (res) => {
      console.log('cron executed without cron value.', JSON.stringify(res.rows));
      if (res.rows && res.rows.length > 0) {
        await Promise.each(res.rows, async function (item, key) {
          let obj = { companyId: item.id }
          await sqsService.sendSQSMessage(JSON.stringify(obj))
            .then((sqsRes) => {
              console.log('Success: ', sqsRes.MessageId);
            })
            .catch((err) => {
              console.log('Sqs service Error: ', err);
            });
        })
        console.log('Done');
      }
    })
    .catch((error) => {
      console.log(error)
    });
}



/*const sampleCronFunc = () => {
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
      sqsService.sendSQSMessage()
        .then((sqsRes) => {
          console.log('Success: ', sqsRes.MessageId);
        })
        .catch((err) => {
          console.log('Sqs service Error: ', err);
        });
    })
    .catch((error) => {
      console.log(error)
    });
}*/

