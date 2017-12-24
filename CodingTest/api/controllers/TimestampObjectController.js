/**
 * ObjectTimestampController
 *
 * @description :: Server-side logic for managing Objecttimestamps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  createNewObject: function(req, res){
    sails.log('Create new object', req.body);
    keys = Object.keys(req.body)
    if (keys.length != 1) return res.serverError(new Error('1 key only.'));
    key = keys[0];
    new_object = {
      key : key,
      value : req.body[key],
    }
    TimestampObject.create(new_object).exec(function (err, records) {
      if (err) return res.serverError(err);
      return res.json(records);
    });
    // return res.send('Hi there!');
  },
  getObject: function(req, res){
    timestamp = req.param('timestamp');
    if (!timestamp) timestamp = Number.MAX_SAFE_INTEGER;
      else timestamp = parseInt(timestamp.replace( /[^\d.]/g, '' ));
    key = req.param('key');
    sails.log('Get a key', key, timestamp, req.body);

    query = {
      where: {
        key: key,
        timestamp: {'<=': timestamp}
      },
      sort: 'timestamp DESC',
      limit: 1,
    }
    TimestampObject.find(query).exec(function (err, timestampObjects){
      if (err) return res.serverError(err);
      if (!timestampObjects || !timestampObjects.length) return res.serverError(new Error('Object not found.'));
      // sails.log('Wow, there are %d objects.  Check it out:', timestampObjects.length, timestampObjects);
      return res.json(timestampObjects);
    });
    // return res.send('Hi there!');
  }

};

