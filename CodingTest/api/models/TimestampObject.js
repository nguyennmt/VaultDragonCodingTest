/**
 * ObjectTimestamp.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  getTimestampNow: function() {

  },
  attributes: {
    key : {
      type : 'string',
      index: true,
      // unique: true
    },
    value : {
      type : 'string'
    },
    timestamp: {
      type: 'integer',
      index: true,
      defaultsTo: function()  {
        if (!Date.now) {
          Date.now = function() { return new Date().getTime(); }
        }
        var timeStamp = Math.floor(Date.now() / 1000);
        return timeStamp;
      },
    },
  }
};

