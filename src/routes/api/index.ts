const router = require('express-promise-router')()
const routes = ['users', 'plants']

for (let route of routes) {
  router.use(`/${route}`, require(`./${route}.ts`))
}

module.exports = router;