# jakobloekke-rabbitmq
AMQP-client for Meteor.js, based on [https://github.com/postwait/node-amqp](https://github.com/postwait/node-amqp).

Exposes a global ```RabbitMQ``` object that you can interact with.

# Usage

The ```RabbitMQ``` object caches your connection and exchanges so you avoid opening multiple connections – which is an issue when using the node-amqp npm-library.

It's also an EventEmitter, so you can initialize the connection like this:
 
    Meteor.startup(function () {
        var options = {
            host: '<hostname>',
            login: '<login>',
            password: '<password>',
            vhost: '<vhost>'
            ... + other settings ...
        };
    
        RabbitMQ.ensureConnection(options);
    });

And then somewhere in your application you can wait for the initialization like this:

    RabbitMQ.on('ready', function () {
        RabbitMQ.connection.exchange('Project.E.MyExchange', {type: 'topic'}, function (exchange) {
            RabbitMQ.exchanges.MyExchange = exchange;
            RabbitMQ.emit('MyExchange is ready');
        });
    });

    // When the exchange is ready, you can work with it
    RabbitMQ.on('MyExchange is ready', function () {
    
        // Sending messages
        RabbitMQ.exchanges.MyExchange.publish('some_routing_key', {greeting: 'Hello world!'});
    
        // Receiving messages
        RabbitMQ.connection.queue('Project.Q.MyQueue', function (q) {
            q.bind(RabbitMQ.exchanges.MyExchange, function (q) {
                q.subscribe({ack: true}, function (message) {
                    
                    // your code for handling incoming messages goes here ...
                    
                    q.shift(); // Only necessary if {ack: true}
                });
            });
        });
    })
    
Errors are also emitted:

    RabbitMQ.on('error', function (err) {
        console.log(err);
    });
    
