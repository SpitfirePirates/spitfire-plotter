
class OutOfBoundsException extends Error
{

   constructor() {
        super('Out of bounds');
        this.name = 'OutOfBoundsException';
    }
}

module.exports = OutOfBoundsException
