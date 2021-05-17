require('dotenv').config({ path: './.env' });

const databaseProvider = require('./app/providers/database');

const sqsService = require('./app/services/sqsSendMessage');

const cron = require('node-cron');

const Promise = require('bluebird');

const limit = 10;
const offset = 0;

/**
 * send Reminders To Companies
 */
exports.sendRemindersToCompanies = async (limit, offset) => {
  try {

    // get getCompanies
    let fetchCompany = await getCompanies(limit, offset);

    if (fetchCompany.rows && fetchCompany.rows.length > 0) {
      return Promise.mapSeries(fetchCompany.rows, async function (item, key) {
        let obj = { companyId: item.id }
        return sqsService.sendSQSMessage(JSON.stringify(obj))
          .then((sqsRes) => {
            console.log('Success: ', sqsRes.MessageId);
            return sqsRes.MessageId
          })
          .catch((err) => {
            console.log('Sqs service Error: ', err);
          });
      }).then(function(result) {
        // This will run after the last step is done
        console.log("Done!" ,result);
        return module.exports.sendRemindersToCompanies(limit, offset + limit);
      });
    }

  } catch (error) {
    console.log('error', error);
  }
}

const getCompanies = (limit, offset) => new Promise((resolve, reject) => {
  
  const companyQuery = databaseProvider
    .knex('companies')
    .select('id')
    .limit(limit)
    .offset(offset);

  return resolve(databaseProvider.executeQuery(companyQuery));  

});

if (process.env.CRON_VALUE) {
  cron.schedule(process.env.CRON_VALUE, () => {
    exports.sendRemindersToCompanies(limit, offset);
  });
}else{
  exports.sendRemindersToCompanies(limit, offset);
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

