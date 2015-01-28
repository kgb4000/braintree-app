var braintree = require ("braintree");

gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "f8k77pk8fh97gp8n",
    publicKey: "bm9tgzxg2pgh4b75",
    privateKey: "ef1510c0fd9bce695fd387ef76a69eeb"
    });

var getUsers = function (req, res) {
    var users =  [
                    {id: 1, username: "David"},
                    {id: 2, username: "Chris"},
                    {id: 3, username: "Jack"}
                 ]

    return res.json(users);
};

var getTithes = function (req, res) {
    var amount = req.query.amount;
    var username = req.query.username;
    var email = req.query.email;

    var tithe = { amount:amount, username:username, email:email }

    return res.json(tithe);
};

var getToken = function (req, res) {
    gateway.clientToken.generate({
    }, function (err, response) {
      var clientToken = response.clientToken
      return res.json(clientToken);
    });

    
};

module.exports = {
    getUsers:getUsers, getTithes:getTithes, getToken:getToken
}