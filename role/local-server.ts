// local-server.ts
import app from './src/app';

const port = 3000;

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
