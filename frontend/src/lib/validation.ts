const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PasswordLengthError = "Password must be at least 8 characters.";
export const PasswordsDontMatchError = "Passwords don't match.";
export const InvalidEmailError = "Please enter a valid email address.";
export const NameLengthError = (name: string) => `${name} must be at least 2 characters.`;
export const RequiredFieldError = (field: string) => `${field} is a required field.`;
export const PhoneNumberError = "Please enter a valid phone number.";
export const WeeksInAdvanceError = "Must be an integer of at least 1.";

export const isPasswordLongEnough = (password: string): boolean => {
  return password.length >= 8;
};

export const isEmailValid = (email: string): boolean => {
  return emailRegex.test(email);
};

export const isNameValid = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const isPhoneValid = (phone: string): boolean => {
    return phone.trim().length >= 10;
};
