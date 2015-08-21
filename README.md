data sources - bb 2001, sa 2005
http://asklib.library.hbs.edu/faq/47473

https://www.jasondavies.com/wordtree/?source=obama-war-speech.txt&prefix=Iraq&reverse=1


### mysql
    mysql -u root -p
    CREATE DATABASE calls;
    create table calls (id varchar(10), company varchar(10), quarter varchar(2), year varchar(4), text text);
    drop table calls;

Clean up tr

    tr < calls.csv -d '\000' > calls2.csv