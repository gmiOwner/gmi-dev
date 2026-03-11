// AUTO-GENERATED — Work Item: 54 | Standards applied: WI-54,SECURITY-HEADERS
// Review before merging. Do not remove this header until reviewed.

import { createApp } from './app';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

app.listen(port, () => {
  // Structured logging (minimal)
  console.log(JSON.stringify({ level: 'info', msg: 'server_started', port }));
});
