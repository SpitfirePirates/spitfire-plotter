
class InvalidShapeException extends Error
{

   constructor(text) {
        super(text);
        this.name = 'InvalidShapeException';
    }
}

module.exports = InvalidShapeException
