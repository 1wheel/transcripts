var io = require('indian-ocean')
var _ = require('lodash')
var d3 = require('d3')
var fs = require('fs')
var request = require('request')
var queue = require('queue-async')

var q = queue(5)

var articles = io.readDataSync(__dirname + '/../data/articleUrls.csv')
var count = 0

var prevDownloads = io.readdirIncludeSync(__dirname + '/../raw-html/', 'html')
var isDownloaded = d3.nest()
    .key(function(d){ return _.last(d.split('/')).replace('.html', '') })
    .map(prevDownloads)

articles.forEach(function(article){
  if (isDownloaded[article.id]) return
  q.defer(downloadArticle, article.id)
})


function downloadArticle(id, cb){
  var url = 'http://seekingalpha.com/earnings_center/all/article/' + id
  request(url, function (err, res, body) {
    cb()
    if (!err && res.statusCode == 200) {
      console.log('count: ', count++, id)
      fs.writeFile(__dirname + '/../raw-html/' + id + '.html', body, noop)
    } else{
      console.log(err ? err : res.statusCode, url)
    }
  })
}


function noop(){}


