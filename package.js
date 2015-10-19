Package.describe({
    name: 'jakobloekke:rabbitmq',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'node-amqp wrapped as an EventEmitter',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/jakobloekke/jakobloekke-rabbitmq',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({
    "amqp": "0.2.4"
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.addFiles('rabbitmq.js', 'server');
    api.export('RabbitMQ', 'server');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('jakobloekke:rabbitmq');
    api.addFiles('rabbitmq-tests.js');
});
