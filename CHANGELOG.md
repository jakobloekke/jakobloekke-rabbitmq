    
# Change history

- 0.1.2: Better documentation
- 0.1.1: Stabilize handling of multiple calls to ```RabbitMQ.ensureConnection()```.
- 0.1.0: Deprecate ```RabbitMQ.createConnection()``` in favour of ```RabbitMQ.ensureConnection()``` which is a more precise name. Emit our own 'ready' event instead of having client code rely on the underlying connection object's own ready-event, which was rather smelly.