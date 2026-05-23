import { main } from '../cmd/generate-release.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
