import app from './app';
import logger from './utils/logger';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`🟢 Server running at ${PORT}`);
});
