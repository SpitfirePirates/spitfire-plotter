
class InvalidTextException extends Error
{

   constructor() {
        super('Invalid Text');
        this.name = 'InvalidTextException';
    }
}

module.exports = InvalidTextException
