import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsJpgFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsJpgFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          return typeof value === 'string' && value.endsWith('.jpg');
        },
        defaultMessage(args: ValidationArguments): string {
          return 'Fiels ' + args.property + ' must be a .jpg file.';
        },
      },
    });
  };
}
