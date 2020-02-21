
class InvalidGraphCallbackException extends Error
{

   constructor(text) {
        super(text);
        this.name = 'InvalidGraphCallbackException';
    }
}

module.exports = InvalidGraphCallbackException
