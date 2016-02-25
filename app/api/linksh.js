'use strict';
module.exports = function(app, db) {

    app.get('/:url', function(req, res) {
        var url = process.env.APP_URL + req.params.url;
        console.log(url);
        if (url != process.env.APP_URL + 'favicon.ico') {
            findURL(url, db, res);
        }
    })


    app.get('/api/linksh', function(req, res) {
        var name = req.query.name;
        var url = req.query.url;
        var urlObj = {};
        urlObj = {
            "original_url": url,
            "short_url": process.env.APP_URL + name
        };
        console.log(name);
        console.log(url);
        res.send(urlObj)

        save(urlObj, db);
    });



    function save(obj, db) {
        // Save object into db.
        var sites = db.collection('sites');
        sites.save(obj, function(err, result) {
            if (err) throw err;
            console.log('Saved ' + result);
        });
    }

    function findURL(link, db, res) {
        // Check to see if the site is already there
        var sites = db.collection('sites');
        console.log(link);
        // get the url
        sites.findOne({
            "short_url": link
        }, function(err, result) {
            if (err) throw err;
            console.log(result);
            // object of the url
            if (result) {
                // we have a result
                console.log('Found ' + result);
                console.log('Redirecting to: ' + result.original_url);
                res.redirect("https://"+result.original_url);
            } else {
                // we don't
                res.send('Site not found');
            }
        });
    }

};
