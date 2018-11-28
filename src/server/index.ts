import * as path from 'path'
import * as http from 'http'

import * as mq from 'mq'

const port = 8080
const srv = new http.Server(port, new mq.Routing({
    '*': http.fileHandler(path.resolve(__dirname, '../browser'))
}));

console.log(`server stared on listening ${port}`)
srv.asyncRun()