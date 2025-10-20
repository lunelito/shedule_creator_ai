export type LoginType = {
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export type RegisterType = {
  errors: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    repeatPassword?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export type FieldsType = Array<{
  type: string | any; // text
  name: string;
  text: string;
  isInvalid: boolean;
  errorMessage: string[];
}>;

export type RegisterFormType = {
  setActiveForm: (form: string) => void;
};