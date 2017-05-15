/**
 * Created by sibi on 5/12/2017.
 */
/*GitHub Contributions*/
/*Aporeto Coding Challenge*/
/*Server using NodeJS and ExpressJS*/
var express = require('express');           //Import Express framework
var request = require('request');           //to make http calls (supports HTTPS)
var bodyParser = require('body-parser');    //Import Body Parser: to get user's input from HTML->AngularJS->NodeJS
var dateTime = require('node-datetime');    //Import Datetime: to get current date
var cors = require('cors')                  //Import CORS: to allow Cross Origin Resource Sharing

var app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Get input from user using POST and /:id
app.post('/:id', function (req,res) {

    var givenDate=0;                               //to store date from which the contributions need to be calculated

    var totIssues=[];                              //to store individual categories total
    var totForks=[];
    var totCommits=[];

    var total=[];                                   //to store total of above three categories

    var individualContributions={
        'individualContributions': []               //JSON array initialization for individual categories
    };

    var totContributions={
        'totContributions': []                      //to store final total in JSON format
    };

    var y=[];                                       //to store date from JSON response
    var z=[];


    //Issues and Forks count of all repositories. Also using OAuth authentication and GitHub Pagination
    request({headers: {
        'User-Agent': 'currentUser',            //Must provide User-Agent to access GitHub API

    },
        uri: 'https://api.github.com/users/'+req.params.id+'/repos?page=1&per_page=10000&client_id=7485dbd1e25dd5959594&client_secret=664b3a08a13ecab5683da48e18324417367d781d',
        }, function (error,response,body) {

        if(error){
            return console.log('Error:', error);
        }

        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }


        repos=JSON.parse(body);             //to parse data as JSON returned after request

        var dt = dateTime.create();
        var formattedDate = dt.format('Y-m-d');         //Changing format to YYYY-MM-DD
        x=new Date(formattedDate).toISOString().slice(0,10);        //storing current date in variable x

        var newIndex1=0;
        var gDate = req.body.gDate;               //getting user's requested date from HTML->AngularJS
        givenDate=new Date(gDate).toISOString().slice(0,10);

        //Looping over the repos to find the total issues and forks of all repos
        for(var i=0;i<repos.length;i++)
        {
            y[i]=new Date(repos[i].created_at).toISOString().slice(0,10);
            y.sort();                           // sorting to reduce additional computations

            if(givenDate<=y[i]&&x>=y[i]) {
                var issue=0;var fork=0;
                issue = issue+repos[i].open_issues_count;
                totIssues[newIndex1]=issue;
                fork=fork+repos[i].forks_count;
                totForks[newIndex1] =fork ;
                newIndex1++;
            }
        }
        //Commits of all repositories
        request({headers: {
            'User-Agent': 'currentUser',
        },
            uri: 'https://api.github.com/users/'+req.params.id+'/events?page=1&per_page=10000&client_id=7485dbd1e25dd5959594&client_secret=664b3a08a13ecab5683da48e18324417367d781d',
        }, function (error,response,body) {

            events=JSON.parse(body)

            var newIndex=0;
            var gDate = req.body.gDate;
            givenDate=new Date(gDate).toISOString().slice(0,10);

            //Looping over the events to find commits of users
            for(var i=0;i<events.length;i++){

                z[i]=new Date(events[i].created_at).toISOString().slice(0,10);
                z.sort();

                if(givenDate<=z[i]&&x>=z[i]) {
                if(events[i].payload.commits!=null){
                    var commit=0;
                    commit=commit+events[i].payload.commits.length;
                    totCommits[newIndex]=commit;
                    newIndex++;
                }
            }}

            //storing contributions by categories
            individualContributions.individualContributions.push({"issues_count": totIssues,"forks_count":totForks,"commit_count":totCommits});

            //adding two arrays without compromising their index positions
            if(totCommits.length>=totIssues.length){
            for(var i=0;i<totCommits.length;i++){
                    if(i<totIssues.length)

                     total.push(totForks[i]+totCommits[i]+totIssues[i])
                else
                    total.push(totCommits[i])


            }}else{
                    for(var i=0;i<totIssues.length;i++){
                        if(i<totCommits.length)
                            total.push(totForks[i]+totCommits[i]+totIssues[i])
                        else
                            total.push(totCommits[i])
                    }
            }
            var finalTotal=0;
            //final total to display the contributions from user's date to current date
            for(var i=0;i<total.length;i++){
                finalTotal=finalTotal+total[i];
            }
            //pushing the total to array
            totContributions.totContributions.push(finalTotal)

            res.contentType('application/json');
            res.write(JSON.stringify(totContributions));               //writing data to server
            res.end();

        })

    });
})

//Server settings
var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Application listening at port %s', port);

})
module.exports = server;                    //exporting server response