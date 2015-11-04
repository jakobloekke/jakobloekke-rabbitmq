# jakobloekke-rabbitmq
AMQP-client for Meteor.js

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

And then elsewhere in your application you can wait for the initialization like this:

    RabbitMQ.on('ready', function () {
        RabbitMQ.connection.exchange('Project.E.ExchangeName', {type: 'topic'}, function (exchange) {
            RabbitMQ.exchanges.ExchangeName = exchange;
            RabbitMQ.emit('ExchangeName is ready');
        });
    });

    RabbitMQ.on('ExchangeName is ready', function () {
        RabbitMQ.connection.queue('Project.Q.QueueName', function (q) {
            console.log('Connected to new queue:', q.name);

            q.bind(RabbitMQ.exchanges.ExchangeName, function (q) {
                q.subscribe({ack: true}, function (message) {
                    // your code
                    q.shift(); // If ack: true
                });
            });
        });
    })
    
Errors are also emitted:

    RabbitMQ.on('error', function (err) {
        console.log(err);
    });
    
    
# Change history

- 0.1.1: Stabilize handling of multiple calls to ```RabbitMQ.ensureConnection()```.
- 0.1.0: Deprecate ```RabbitMQ.createConnection()``` in favour of ```RabbitMQ.ensureConnection()``` which is a more precise name. Emit our own 'ready' event instead of having client code rely on the underlying connection object's own ready-event, which was rather smelly.