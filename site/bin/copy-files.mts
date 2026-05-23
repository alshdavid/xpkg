import { main } from '../cmd/copy-files.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
