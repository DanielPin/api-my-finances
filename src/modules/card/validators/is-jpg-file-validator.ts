import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsJpgFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsJpgFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value.endsWith('.jpg');
        },
        defaultMessage(args: ValidationArguments) {
          // Personalize a mensagem de erro aqui
          return 'O campo ' + args.property + ' deve ser um arquivo .jpg.';
        },
      },
    });
  };
}
