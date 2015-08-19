var io = require('indian-ocean')
var _ = require('lodash')
var d3 = require('d3')
var fs = require('fs')
var queue = require('queue-async')
var cheerio = require('cheerio')


var q = queue(500)

var articles = io.readDataSync(__dirname + '/../data/articleUrls.csv')
var count = 0

articles.forEach(function(article){
  q.defer(parseArticle, article)
})


function parseArticle(article, cb){
  fs.readFile(__dirname + '/../raw-html/' + article.id + '.html', 'utf-8', function(err, html){
    if (err){
      cb()
      return console.log(err)
    }

    var $ = cheerio.load(html)
    article.intro = $('#article_content').text()
    cb()
  })
}


q.awaitAll(function(){
  fs.writeFile('articles.csv', d3.csv.format(articles)) 
})


function noop(){}


