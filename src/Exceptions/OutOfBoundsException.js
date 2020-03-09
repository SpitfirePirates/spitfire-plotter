
class OutOfBoundsException extends Error
{

   constructor(position) {
        super(`{x: ${position.x}, y: ${position.y}} is out of bounds`);
        this.name = 'OutOfBoundsException';
    }
}

module.exports = OutOfBoundsException
