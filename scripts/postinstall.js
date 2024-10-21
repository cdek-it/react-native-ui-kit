#!/usr/bin/env node
/* eslint-disable no-console */
if (process.env.INIT_CWD === process.cwd()) {
  // Install Lefthook if not CI
  if (!process.env.CI) {
    import('child_process')
      .then(({ exec }) => {
        const result = exec('lefthook install')
        result.stdout?.on('data', (data) => {
          console.log(data)
        })

        result.on('exit', (code) => {
          process.exit(code ?? undefined)
        })
      })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  }
}
