const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const params = {
  MessageBody: 'Information about current NY Times fiction bestseller for week of 25/03/2021',
  QueueUrl: process.env.SQS_QUEUE_URL,
};

const sendSQSMessage = () => new Promise((resolve, reject) => {
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      return reject(err);
    } else {
      return resolve(data);
    }
  });
});

module.exports = {
  sendSQSMessage,
};
