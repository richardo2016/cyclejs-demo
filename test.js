const test = require('test')
test.setup()

require('./lib/server/index')

describe('nothing to do', () => {
    it('nothing', () => {
        assert.isTrue(true)
    })
})

test.run(console.DEBUG)

if (!process.env.DEV) {
    process.exit()
}