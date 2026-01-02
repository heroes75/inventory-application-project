class CustomDatabaseError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        this.name = 'DATABASE ERROR'
    }
}

module.exports = CustomDatabaseError