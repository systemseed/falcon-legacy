const app = require('./app');
// Load the Platform.sh configuration.
const config = require('platformsh').config();

const PORT = config ? config.port : 3001;

app.listen(PORT, (error) => {
  const boldBlue = text => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`;
  if (error) {
    console.error(error);
  }
  else {
    console.info(`Server is listening on ${boldBlue(PORT)}`);
  }
});
