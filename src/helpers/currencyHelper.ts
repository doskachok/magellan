var currencySymbols = {
  'USD': '$', // US Dollar
  'EUR': '€', // Euro
  'CRC': '₡', // Costa Rican Colón
  'GBP': '£', // British Pound Sterling
  'ILS': '₪', // Israeli New Sheqel
  'INR': '₹', // Indian Rupee
  'JPY': '¥', // Japanese Yen
  'KRW': '₩', // South Korean Won
  'NGN': '₦', // Nigerian Naira
  'PHP': '₱', // Philippine Peso
  'PLN': 'zł', // Polish Zloty
  'PYG': '₲', // Paraguayan Guarani
  'THB': '฿', // Thai Baht
  'UAH': '₴', // Ukrainian Hryvnia
  'VND': '₫', // Vietnamese Dong
};


export const getSymbolFromCurrencyCode = (code: string) => {
  if (currencySymbols[code as keyof typeof currencySymbols] !== undefined) {
    return currencySymbols[code as keyof typeof currencySymbols];
  }
};

export const getCurrencyWithSymbolString = (amount: number, code: string) => {
  return "" + amount + ' ' + getSymbolFromCurrencyCode(code);
};
