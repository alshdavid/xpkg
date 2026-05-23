import { main } from '../cmd/test.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
