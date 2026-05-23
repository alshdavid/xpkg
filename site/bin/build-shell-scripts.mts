import { main } from '../cmd/build-shell-scripts.mts'

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
