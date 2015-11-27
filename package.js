Package.describe({
    name: 'jakobloekke:rabbitmq',
    version: '0.1.2',
    // Brief, one-line summary of the package.
    summary: 'node-amqp wrapped as an EventEmitter',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/jakobloekke/jakobloekke-rabbitmq',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({
    "amqp": "0.2.4",
    "wait-until": "0.0.2"
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.addFiles('rabbitmq.js', 'server');
    api.export('RabbitMQ', 'server');
});