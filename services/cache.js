const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const keys = require("../config/keys");

const redisUrl = keys.redisURL;
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

var exec = mongoose.Query.prototype.exec;

// toggalable cache

mongoose.Query.prototype.cache = function(options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");

  return this;
};

mongoose.Query.prototype.exec = async function() {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  const cacheValue = await client.hget(this.hashKey, key);
  if (cacheValue) {
    console.log("SERVING FROM CACHE");

    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result));
  return result;
};

module.exports = {
  clearHash: function(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
