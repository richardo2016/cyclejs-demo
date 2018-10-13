import * as fs from 'fs'
import * as path from 'path'

import * as http from 'http'

const port = 8080
const srv = new http.Server(port, {
    '*': http.fileHandler(path.resolve(__dirname, '../browser'))
});

srv.run(() => {})
console.log(`server stared on listening ${port}`)