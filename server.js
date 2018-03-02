const axios= require('axios'),
express = require('express'),
mongojs = require('mongojs');


const connectionString='mongodb://127.0.0.1/transactions';
const db = mongojs(connectionString,["myTransations"]);

const port = 5000;

var app= express();
var exphbs = require('express-handlebars'); 

app.set('views', './views');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//app.set('view engine', 'handlebars');


app.listen(port, function () {
    console.log("Server is running on "+ port +" port");
  });

  
app.get('/', (req, res) => {  
    // find everything
    db.myTransations.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
    if(err){
        res.send('error');
    }
    res.render('index', { title: 'Hey', transactions: docs })});
});

app.get('/pay/:amount',(req,res)=>{
    amount =req.params.amount;

    axios.post('http://10.201.239.73:18346/ipg/c2bpayment/',
{
    "input_ServiceProviderCode": "110368",
    "input_CustomerMSISDN": "258843747849",
    "input_Amount": amount,
    "input_TransactionReference": "T12344C",
    "input_ThirdPartyReference": "c7e156a6-d339-27f1-7ece-c61566de799a"
},
 {
    headers:{
        Authorization: ' Bearer jdwkSzKN/ufMh0w1oaMIM824P4avGitbRVhlHa5KtaOxZT5c6SX6Dl7poktwo9HZKSS1LZJ9i9DiU6TpTVu2TKBNnoYE568yqTnqOZM4yfFmIXN2GjN53cVO2i5/6qLb3EuMtxclICfyz/Dd2vrcU9VkvlQCjdfpUkgQjNQFcv8zyYDUZGfDRrNqzJgF6Sg/2jcujYddvYd31aopfrwpKVNj7fuZmdb4yJg6P3trPUxGI35eTxmm1/OJHk+LiJ+vxepExzwwWUj+FzxFgtXpLIi63z53/xczlN2MNGBaccTB6q9hQbI5GwzYvJrnPUTTO+HeWEbGiL1FYkTL1yxNyyb1I8RDUN+i4qD6egzZ/3GgeNmMapYKb2Z2gS3ITppSw6VTlR90QoxQnlg9MWbPJFOHqJRVXTp3VGt3zXoyUfhAlCcGKxHaHTM+puTzn9wRa3hr5W5ixfilu1oFxn2v+a/pehzASR3Znj6mow2/M71l70P0pdmWJZGHLSjunSLeDUHWg+dCa6o9TeaqwwoEYM4o6FSk0gg1YatYbxoBwpi5+3mDYKPNFmqTWmWU9ed/Hahtt/2WSmIMMy+p9MrnolDVD8iV8dO/ZQebK/R/Hzizb5J6DwH8HvSYdoydIYGRgvuBdv4Zwb6Rho0YON3uJ+bj1b75k7y3l2nVGS6cWvw=',
        'Content-Type': ' application/json'
    }
  })
  .then(function (response) {
      db.myTransations.insert(response.data,(err,doc)=>{
          if(err){
            res.send(err+'error');                  
          }
        res.send(doc);    
      })
      console.log(response.data);      
  })
  .catch(function (error) {
    res.send(error.data);
  });

});

app.post('/reversal/:transactionId',(req,res)=>{
    transactionId =req.params.transactionId;
    db.myTransations.findOne({
        _id: mongojs.ObjectId(transactionId)
    }, function(err, doc) {
        reverseTransaction(doc,res);
    })


});

function reverseTransaction(doc,res){
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
        headers:{
            Authorization: ' Bearer jdwkSzKN/ufMh0w1oaMIM824P4avGitbRVhlHa5KtaOxZT5c6SX6Dl7poktwo9HZKSS1LZJ9i9DiU6TpTVu2TKBNnoYE568yqTnqOZM4yfFmIXN2GjN53cVO2i5/6qLb3EuMtxclICfyz/Dd2vrcU9VkvlQCjdfpUkgQjNQFcv8zyYDUZGfDRrNqzJgF6Sg/2jcujYddvYd31aopfrwpKVNj7fuZmdb4yJg6P3trPUxGI35eTxmm1/OJHk+LiJ+vxepExzwwWUj+FzxFgtXpLIi63z53/xczlN2MNGBaccTB6q9hQbI5GwzYvJrnPUTTO+HeWEbGiL1FYkTL1yxNyyb1I8RDUN+i4qD6egzZ/3GgeNmMapYKb2Z2gS3ITppSw6VTlR90QoxQnlg9MWbPJFOHqJRVXTp3VGt3zXoyUfhAlCcGKxHaHTM+puTzn9wRa3hr5W5ixfilu1oFxn2v+a/pehzASR3Znj6mow2/M71l70P0pdmWJZGHLSjunSLeDUHWg+dCa6o9TeaqwwoEYM4o6FSk0gg1YatYbxoBwpi5+3mDYKPNFmqTWmWU9ed/Hahtt/2WSmIMMy+p9MrnolDVD8iV8dO/ZQebK/R/Hzizb5J6DwH8HvSYdoydIYGRgvuBdv4Zwb6Rho0YON3uJ+bj1b75k7y3l2nVGS6cWvw=',
            'Content-Type': ' application/json'
        }
      })
      .then(function (response) {
        res.send(response.data);    
        console.log(response.data);      
      })
      .catch(function (error) {
          console.log(error);
        res.send(error.data);
      });
    
}