var io = require('indian-ocean')
var _ = require('lodash')
var d3 = require('d3')
var fs = require('fs')
var queue = require('queue-async')
var cheerio = require('cheerio')


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'calls'
})
connection.connect()

//Test if connection is working
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});


var q = queue(500)
var count = 0

var articles = io.readDataSync(__dirname + '/../data/articleUrls.csv')
articles.forEach(function(article, i){ q.defer(parseArticle, article) })

function parseArticle(article, cb){
  fs.readFile(__dirname + '/../raw-html/' + article.id + '.html', 'utf-8', function(err, html){
    if (err){ return console.log(err) && cb() }

    var $ = cheerio.load(html)
    var qMatch = $('title').text().match(/\sQ\d\s20\d\d\s/)
    if (!qMatch || !qMatch[0]) return cb()

    var quarter = qMatch[0].split(' ')[1]
    var year = qMatch[0].split(' ')[2]

    var text = $('#article_content').text().replace(/\n/g, '  ')

    var obj = {id: article.id, company: article.company, quarter: quarter, year: year, text: text}    
    connection.query('INSERT INTO calls SET ?', obj, function(err, rows, fields){
      cb()
      count++
      if (!(count % 100)) console.log(count)
    })
  })
}


q.awaitAll(function(){ console.log('done!') })