import routes from './routes';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(3000, async () => {
  console.log('Starting server...');
  await mongoose.connect('mongodb://localhost/demo-db', { useNewUrlParser: true, useCreateIndex: true })
      .then(() => console.log('Database ready!'));

  console.log('Listening on port 3000!')
});
