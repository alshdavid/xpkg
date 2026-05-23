import { main } from '../cmd/build-page.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
