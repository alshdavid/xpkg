import { main } from '../cmd/generate-package-index.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
