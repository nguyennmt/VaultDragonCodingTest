var request = require('supertest');

describe('TimestampObjectController', function() {

  describe('#createObject()', function() {
    it('should create and return an object', function (done) {
      request(sails.hooks.http.app)
        .post('/object')
        .send({ test: 'test_value' })
        .expect(200)
        .expect('test', done['key'])
        .expect('test_value', done['value']);
      done();
    });
  });

  describe('#getObject()', function() {
    it('should return an object', function (done) {
      request(sails.hooks.http.app)
        .get('/object/test')
        .expect(200)
        .expect({value: 'test_value'}, done);
    });
  });

});
