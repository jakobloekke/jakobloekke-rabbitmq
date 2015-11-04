var amqp = Npm.require('amqp'),
    EventEmitter = Npm.require('events').EventEmitter,
    waitUntil = Npm.require('wait-until');

RabbitMQ = _objectAsEventEmitter({});
RabbitMQ.connection = null;
RabbitMQ.exchanges = {};

RabbitMQ.ensureConnection = function (options) {
    if (options && !RabbitMQ.connection) {
        RabbitMQ.connection = amqp.createConnection(options);

        RabbitMQ.connection.on('ready', function () {
            RabbitMQ.emit('ready');
        });

        RabbitMQ.connection.on('error', function (err) {
            RabbitMQ.emit('error', err);
        });
    } else {
        // We need to wait until the connection has become ready to re-emit the ready event
        waitUntil()
            .interval(500)
            .times(10)
            .condition(function () {
                return (RabbitMQ.connection.readyEmitted ? true : false);
            })
            .done(function () {
                RabbitMQ.emit('ready');
            });
    }
};

/**
 * @deprecated use ensureConnection instead
 */
RabbitMQ.createConnection = RabbitMQ.ensureConnection;

/**
 * http://stackoverflow.com/a/29722360/245540
 * @param obj
 */
function _objectAsEventEmitter(obj) {
    // copy EventEmitter prototype to obj, but make properties
    // non-enumerable
    for (var prop in EventEmitter.prototype) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            writable: true,
            value: EventEmitter.prototype[prop]
        });
    }

    // also, make sure the following properties are hidden
    // before the constructor adds them
    ["domain", "_events", "_maxListeners"].forEach(function (prop) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            writable: true,
            value: undefined
        });
    });

    // call EventEmitter constructor on obj
    EventEmitter.call(obj);

    // return the obj, which should now function as EventEmitter
    return obj;
}