var amqp = Npm.require('amqp'),
    EventEmitter = Npm.require('events').EventEmitter;

RabbitMQ = _objectAsEventEmitter({});
RabbitMQ.connection = null;
RabbitMQ.exchanges = {};

RabbitMQ.createConnection = function (options) {
    RabbitMQ.connection = amqp.createConnection(options);
    RabbitMQ.connection.on('error', function (err) {
        console.log(err);
    });
};


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