const EmailValidator = require('email-deep-validator');
const bodyParser = require('body-parser');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const port = process.env.PORT || 8080;


const emailValidator = new EmailValidator();

async function validate(email) {
    const result = {};
    let success = false;
    let response = null;
    try {
        response = await emailValidator.verify(email);
        success = true;
    } catch (error) {
        response = error;
    }
    result["email"] = email;
    result["message"] = response;
    if(success){
        result['code'] = Object.values(response).reduce((acc, cur) => acc + cur, 0);
    }

    return result;
}
async function validateEmail(email) {
    const result = {};
    let success = false;
    let response = null;
    try {
        response = await emailValidator.verify(email);
        success = true;
    } catch (error) {
        response = error;
    }

    return response;
}


app.get('/', (req, res, next) => res.send('Running'))
// use res.render to load up an ejs view file

// index page
app.get('/mass', function(req, res) {

    var tagline = "";

    res.render('index', {
        results: [],
        tagline: tagline
    });
});



app.get('/email/:email', async function(req, res, next) {
    var email = req.params.email;
    var result = await validateEmail(email);
    res.json(result);
});


app.get('/validate/:email', async function(req, res, next) {
    var email = req.params.email;
    var result = await validate(email);
    res.json(result);
});


app.post('/emails/', async function(req, res, next) {
    const emails = req.body.email;
    const resultPromise = emails.map(email => validate(email));
    const responses = await Promise.all(resultPromise);
    const results = responses.reduce(function(finalResult, currentValue) {
        if (!finalResult["emails"]) finalResult["emails"] = [];
        const { email, message, code } = currentValue;
        finalResult["emails"].push({
            email,
            message,
            code
        });
        return finalResult;
    }, {});

    res.json(results);

});


app.get('/wakemydyno.txt', function() {
    res.sendFile(__dirname + "/wakemydyno.txt");
});


app.listen(port, function() {
    console.log(`EmailValidator is running on localhost:${port}`)
});
