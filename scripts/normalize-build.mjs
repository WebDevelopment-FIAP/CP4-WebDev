import { rename, rm } from 'node:fs/promises'

await rm('dist/index.html', { force: true })
await rename('dist/app.html', 'dist/index.html')
