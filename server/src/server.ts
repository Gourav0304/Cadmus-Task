import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`🟢 Server running at ${PORT}`);
});
