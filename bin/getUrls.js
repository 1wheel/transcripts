var fs = require('fs')
var d3 = require('d3')
var request = require('request')
var cheerio = require('cheerio')
var queue = require('queue-async')
var _ = require('underscore')

var q = queue(15)

var articles = []

// d3.range(1, 3335).forEach(function(i){
d3.range(1, 15).forEach(function(i){
  q.defer(function(cb){
    var url = 'http://seekingalpha.com/earnings_center/transcripts/all/' + i
  
    request(url, function(error, response, html){
      var $ = cheerio.load(html)
      $ ('#analysis_list_container li').each(function(){
        var article = {}
        article.url = $('.article_title', this).attr('href')
        article.id = _.last(article.url.split('-')[0].split('/'))
        article.company = $('.article_symbols', this).text()
        article.date = $('.date span:last-child', this).text()
        articles.push(article)
      })

      cb()
    })
  })
})

q.awaitAll(function(err){
  fs.writeFile(__dirname + '/../data/articleUrls.csv', d3.csv.format(articles))
})


