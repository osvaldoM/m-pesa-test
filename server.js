const axios = require('axios'),
    express = require('express'),
    mongojs = require('mongojs'),
    exphbs = require('express-handlebars'),
    dotEnv = require('dotenv').config({ path: './.env' }),
    crypto = require("crypto");


const env = process.env,
    connectionString = env.DB_SERVER + '/transactions',
    db = mongojs(connectionString, ["myTransactions"]),
    port = env.PORT_NUMBER,
    defaultHeaders = {
        'Authorization': env.AUTHORIZATION_TOKEN,
        'Content-Type': ' application/json'
    },
    payment_endpoint = 'http://10.201.239.73:18346/ipg/c2bpayment/',
    reverseTransactionEndpoint = 'http://10.201.239.73:18348/ipg/reversal/'


var app = express();

app.set('views', './views');
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
    //comment this line if upstream server is online;
    return res.render('index', { title: 'm-pesa test', transactions: mockData });
    db.myTransactions.find( (err, docs) => {
        if (err) {
            res.send('error');
        }
        res.render('index', { title: 'm-pesa test', transactions: docs });
    });
});

app.post('/:amount', (req, res) => {
    amount = req.params.amount;

    axios.post(payment_endpoint,
        {
            "input_ServiceProviderCode": env.INPUT_SERVICE_PROVIDER_CODE,
            "input_CustomerMSISDN": env.INPUT_CUSTOMER_MSISDN,
            "input_Amount": amount,
            "input_TransactionReference": generateTransactionRefference,
            "input_ThirdPartyReference": env.INPUT_THIRD_PARTY_REFERENCE
        },
        {
            headers: defaultHeaders
        })
        .then((response) => {
            db.myTransactions.insert(response.data, (err, doc) => {
                if (err) {
                    res.send(err + 'error');
                }
                res.send(response.data);
            });
        })
        .catch( (error) => {
            res.status(502).send(error.data);
        });

});

app.post('/reversal/:transactionId', (req, res) => {
    transactionId = req.params.transactionId;
    db.myTransactions.findOne({
        _id: mongojs.ObjectId(transactionId)
    }, (err, doc) => {
        reverseTransaction(doc, res);
    })


});

function reverseTransaction(doc, res) {
    // res.send(doc); 
    // return;   
    axios.post(reverseTransactionEndpoint,
        {
            "input_ServiceProviderCode": doc.input_ServiceProviderCode,
            "input_Amount": doc.input_Amount,
            "input_InitiatorIdentifier": 'STB Initiator',
            "input_SecurityCredential": 'Mpesa2019',
            "input_TransactionID": doc.output_TransactionID
        },
        {
            headers: defaultHeaders
        })
        .then((response) => {
            res.send(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            res.status(502).send(error.data);
        });

};

function getTransactionStatus(doc, res) {
    // res.send(doc); 
    // return;   
    axios.post('http://10.201.239.73:18348/ipg/reversal/',
        {
            "input_ServiceProviderCode": doc.input_ServiceProviderCode,
            "input_Amount": doc.input_Amount,
            "input_InitiatorIdentifier": 'STB Initiator',
            "input_SecurityCredential": 'Mpesa2019',
            "input_TransactionID": doc.output_TransactionID
        },
        {
            headers: defaultHeaders
        })
        .then((response) => {
            res.send(response.data);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
            res.send(error.data);
        });

}

function generateTransactionRefference() {
    return crypto.randomBytes(20).toString('hex');
};


var mockData = [
    {
        "_id": "5a993e2977f9a66c027bfa68",
        "input_Amount": 124,
        "output_ResponseCode": "INS-0",
        "input_TransactionReference": "T12344C",
        "output_ResponseDesc": "Request processed successfully",
        "output_TransactionID": "5C2300CVWN",
        "output_TransactionID": "5C2300CVWN",
        "input_CustomerMSISDN": 258846374832,
        "input_ThirdPartyReference": "c7e156a6-d339-27f1-7ece-c61566de799a",
        "check status": "check status",
        "reverse": "reverse"
    },
    {
        "_id": "5a9961d182e07020fb4ce16b",
        "input_Amount": 124,
        "output_ResponseCode": "INS-0",
        "input_TransactionReference": "c7e156a6-d339-27f1-7ece-c61566de799a",
        "output_ResponseDesc": "Request processed successfully",
        "output_TransactionID": "5C2900CVXX",
        "output_TransactionID": "5C2900CVXX",
        "input_CustomerMSISDN": 2584534563,
        "input_ThirdPartyReference": "Bearer jdwkSzKN/ufMh0w1oaMIM824P4avGitbRVhlHa5KtaOxZT5c6SX6Dl7poktwo9HZKSS1LZJ9i9DiU6TpTVu2TKBNnoYE568yqTnqOZM4yfFmIXN2GjN53cVO2i5/6qLb3EuMtxclICfyz/Dd2vrcU9VkvlQCjdfpUkgQjNQFcv8zyYDUZGfDRrNqzJgF6Sg/2jcujYddvYd31aopfrwpKVNj7fuZmdb4yJg6P3trPUxGI35eTxmm1/OJHk+LiJ+vxepExzwwWUj+FzxFgtXpLIi63z53/xczlN2MNGBaccTB6q9hQbI5GwzYvJrnPUTTO+HeWEbGiL1FYkTL1yxNyyb1I8RDUN+i4qD6egzZ/3GgeNmMapYKb2Z2gS3ITppSw6VTlR90QoxQnlg9MWbPJFOHqJRVXTp3VGt3zXoyUfhAlCcGKxHaHTM+puTzn9wRa3hr5W5ixfilu1oFxn2v+a/pehzASR3Znj6mow2/M71l70P0pdmWJZGHLSjunSLeDUHWg+dCa6o9TeaqwwoEYM4o6FSk0gg1YatYbxoBwpi5+3mDYKPNFmqTWmWU9ed/Hahtt/2WSmIMMy+p9MrnolDVD8iV8dO/ZQebK/R/Hzizb5J6DwH8HvSYdoydIYGRgvuBdv4Zwb6Rho0YON3uJ+bj1b75k7y3l2nVGS6cWvw=",
        "check status": "check status",
        "reverse": "reverse"
    }
];