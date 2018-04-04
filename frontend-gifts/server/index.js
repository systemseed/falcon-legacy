const app = require('./app');

let PORT = 3000;
if (process.env.PLATFORM_PROJECT) {
  // Load the Platform.sh configuration.
  PORT = require('platformsh').config().port;
}

app.listen(PORT, (error) => {
  const boldBlue = text => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`;
  if (error) {
    console.error(error);
  }
  else {
    console.info(`Server is listening on ${boldBlue(PORT)}`);
  }
});
