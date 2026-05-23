import { main } from '../cmd/republish-latest.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
