var EE = require('events') 
  , fakeEvents  = new EE

 
function follow_feed(opts, cb) {
  ch_feed.on('change', function(ch) { return cb && cb.call(ch_feed, null, ch) });

  process.nextTick(function() {
    ch_feed.follow();
  })

  return ch_feed;
}

module.exports = follow_feed;
