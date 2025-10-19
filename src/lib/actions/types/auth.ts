type RegisterFormType = {
  setActiveForm: React.Dispatch<React.SetStateAction<string>>;
};

type FieldType = {
  type: "password" | "text" | "number";
  text: string;
  name: string;
  isInvalid: boolean;
  errorMessage: string[];
};

type FieldsType = FieldType[];

export type { RegisterFormType, FieldType,FieldsType };
