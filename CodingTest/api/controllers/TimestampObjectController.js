/**
 * ObjectTimestampController
 *
 * @description :: Server-side logic for managing Objecttimestamps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  createNewObject: function(req, res){
    /* client send a json { key: value }
    * server will store that object and return {key: "key", value: "value", timestamp: now}
    */
    sails.log('Create new object', req.body);

    keys = Object.keys(req.body)
    if (keys.length != 1) return res.badRequest({message: '1 key only.', error:1});

    key = keys[0];
    new_object = {
      key : key,
      value : req.body[key].toString(),
    }

    TimestampObject.create(new_object).exec(function (err, records) {
      if (err) return res.serverError(err);
      // if (err) return res.serverError({'error': err, message: 'Internal Error'});
      data = {
        key: records['key'],
        value: records['value'],
        timestamp: records['timestamp'],
      }
      return res.json(data);
    });
  },

  getObject: function(req, res){
    /* client send 2 params: key, timestamp
    * if timestamp == None => timestamp = Now
    * server will get value of that key at that time (timestamp) and return { value: "value"}
    */
    timestamp = req.param('timestamp');
    sails.log('Get a key', key, timestamp, req.body);

    if (!timestamp) timestamp = Number.MAX_SAFE_INTEGER;
      else {
        if (timestamp.replace( /[^\d.]/g, '' ) != timestamp)
          return res.notFound({message: 'Timestamp is not valid.', error:1});
        timestamp = parseInt(timestamp.replace( /[^\d.]/g, '' ));
      }

    key = req.param('key');
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
      // if (err) return res.serverError({'error': err, message: 'Internal Error'});
      if (!timestampObjects || !timestampObjects.length) return res.notFound({message: 'Object not found.', error:1});
      sails.log('Wow, there are %d objects.  Check it out:', timestampObjects.length, timestampObjects);
      records = timestampObjects[0];
      data = {
        // key: records['key'],
        value: records['value'],
        // timestamp: records['timestamp'],
      }
      return res.json(data);
    });
  }

};

