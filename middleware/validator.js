const validators = {
  REGEX_NAME: /^[a-zA-Z\s]{1,50}$/,
  REGEX_EMAIL: /^[^"'!,/\\]{1,70}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  REGEX_MOBILE: /^\d{10}$/,
  REGEX_AADHAR: /^\d{12}$/,
};

module.exports = validators