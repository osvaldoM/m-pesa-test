var authorizationToken='Bearer jdwkSzKN/ufMh0w1oaMIM824P4avGitbRVhlHa5KtaOxZT5c6SX6Dl7poktwo9HZKSS1LZJ9i9DiU6TpTVu2TKBNnoYE568yqTnqOZM4yfFmIXN2GjN53cVO2i5/6qLb3EuMtxclICfyz/Dd2vrcU9VkvlQCjdfpUkgQjNQFcv8zyYDUZGfDRrNqzJgF6Sg/2jcujYddvYd31aopfrwpKVNj7fuZmdb4yJg6P3trPUxGI35eTxmm1/OJHk+LiJ+vxepExzwwWUj+FzxFgtXpLIi63z53/xczlN2MNGBaccTB6q9hQbI5GwzYvJrnPUTTO+HeWEbGiL1FYkTL1yxNyyb1I8RDUN+i4qD6egzZ/3GgeNmMapYKb2Z2gS3ITppSw6VTlR90QoxQnlg9MWbPJFOHqJRVXTp3VGt3zXoyUfhAlCcGKxHaHTM+puTzn9wRa3hr5W5ixfilu1oFxn2v+a/pehzASR3Znj6mow2/M71l70P0pdmWJZGHLSjunSLeDUHWg+dCa6o9TeaqwwoEYM4o6FSk0gg1YatYbxoBwpi5+3mDYKPNFmqTWmWU9ed/Hahtt/2WSmIMMy+p9MrnolDVD8iV8dO/ZQebK/R/Hzizb5J6DwH8HvSYdoydIYGRgvuBdv4Zwb6Rho0YON3uJ+bj1b75k7y3l2nVGS6cWvw=';

$(function(){


    $('button').on('click',function(){
        console.log('rock on');
    
        $.ajax('http://10.201.239.73:18346/ipg/c2bpayment/ HTTP/1.1',{
            type:'POST',
            data:{
                "input_ServiceProviderCode": "110368",
                "input_CustomerMSISDN": "258843747849",
                "input_Amount": "10",
                "input_TransactionReference": "T12344C",
                "input_ThirdPartyReference": "c7e156a6-d339-27f1-7ece-c61566de799a"
            },
            headers:{
                Authorization: 'Bearer jdwkSzKN/ufMh0w1oaMIM824P4avGitbRVhlHa5KtaOxZT5c6SX6Dl7poktwo9HZKSS1LZJ9i9DiU6TpTVu2TKBNnoYE568yqTnqOZM4yfFmIXN2GjN53cVO2i5/6qLb3EuMtxclICfyz/Dd2vrcU9VkvlQCjdfpUkgQjNQFcv8zyYDUZGfDRrNqzJgF6Sg/2jcujYddvYd31aopfrwpKVNj7fuZmdb4yJg6P3trPUxGI35eTxmm1/OJHk+LiJ+vxepExzwwWUj+FzxFgtXpLIi63z53/xczlN2MNGBaccTB6q9hQbI5GwzYvJrnPUTTO+HeWEbGiL1FYkTL1yxNyyb1I8RDUN+i4qD6egzZ/3GgeNmMapYKb2Z2gS3ITppSw6VTlR90QoxQnlg9MWbPJFOHqJRVXTp3VGt3zXoyUfhAlCcGKxHaHTM+puTzn9wRa3hr5W5ixfilu1oFxn2v+a/pehzASR3Znj6mow2/M71l70P0pdmWJZGHLSjunSLeDUHWg+dCa6o9TeaqwwoEYM4o6FSk0gg1YatYbxoBwpi5+3mDYKPNFmqTWmWU9ed/Hahtt/2WSmIMMy+p9MrnolDVD8iV8dO/ZQebK/R/Hzizb5J6DwH8HvSYdoydIYGRgvuBdv4Zwb6Rho0YON3uJ+bj1b75k7y3l2nVGS6cWvw=',
                'Content-Type': 'application/json'
            },
            success:function(res){
                console.log(res);
            },
            error:function(err){
                console.log(err)
            }
            
        });
    })
});


// url:'http://10.201.239.73:18346/ipg/c2bpayment/',
// type:'POST',
// contentType:'application/json',
// data:{
//     "input_ServiceProviderCode": "110368",
//     "input_CustomerMSISDN": "258843747849",
//     "input_Amount": "10",
//     "input_TransactionReference": "T12344C",
//     "input_ThirdPartyReference": "c7e156a6-d339-27f1-7ece-c61566de799a"
// },
// beforeSend: function(request) {
//     request.setRequestHeader("Authorization", authorizationToken);
//   },
//   success:function(res){
//     console.log(res);
//   },
//   error:function(err){
//       console.log(err)
//   }