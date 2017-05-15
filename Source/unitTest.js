/**
 * Created by sibi on 5/15/2017.
 */
var request = require('supertest');                                 //import SuperTest: to test http requests and responses

describe('Starting Up the Server', function () {

    var server;

    beforeEach(function () {
        delete require.cache[require.resolve('./server')];
        server = require('./server');                              //starting the server
    });

    afterEach(function () {
        server.close();                                             //closing the server
    });

    it('Respond to /sibicramesh', function testSlash(done) {
        request(server)
            .post('/sibicramesh')                                   //Success Check
            .expect(200, done);
    });

    it('404 otherwise?', function testPath(done) {
        request(server)
            .get('/nopath')                                          //Other check
            .expect(404, done);
    });
});