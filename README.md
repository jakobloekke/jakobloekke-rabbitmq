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
    
        RabbitMQ.createConnection(options);
    
        RabbitMQ.connection.on('ready', function () {
            RabbitMQ.connection.exchange('Project.E.ExchangeName', {type: 'topic'}, function (exchange) {
                RabbitMQ.exchanges.ExchangeName = exchange;
                RabbitMQ.emit('ExchangeName is ready');
            });
        });
    });


And then elsewhere in your application you can wait for the initialization like this:

    RabbitMQ.on('ExchangeName is ready', function () {
        RabbitMQ.connection.queue('Project.Q.QueueName', function (q) {
            console.log('Connected to new queue:', q.name);

            q.bind(RabbitMQ.exchanges.ExchangeName, function (q) {
                console.log('Bound ' + q.name + ' queue to ExchangeName');

                q.subscribe({ack: true}, function (message) {
                    // ... handle the message ...
                });
            });
        });
    })