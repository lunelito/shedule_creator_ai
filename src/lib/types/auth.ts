type RegisterFormType = {
  setActiveForm: React.Dispatch<React.SetStateAction<string>>;
};

type FieldsType = {
  type: "password" | "text" | "number" | "file";
  text: string;
  name: string;
  isInvalid: boolean;
  errorMessage: string[];
}[];


export type { RegisterFormType,FieldsType };