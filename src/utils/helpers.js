import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a random UUID string.
 */
export const generateId = () => uuidv4();

/**
 * Generate a random numeric barcode string (12 digits – EAN-style).
 */
export const generateBarcode = () => {
  const digits = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
  return digits;
};

/**
 * Format a number as Indian Rupee currency.
 */
export const formatCurrency = (amount) => {
  return `₹${Number(amount).toFixed(2)}`;
};

/**
 * Validate a product form object.
 * Returns { valid: boolean, errors: { [field]: string } }
 */
export const validateProduct = (product, existingProducts = [], editingId = null) => {
  const errors = {};

  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required.';
  }

  const price = parseFloat(product.price);
  if (isNaN(price) || price < 0) {
    errors.price = 'Enter a valid price (≥ 0).';
  }

  const qty = parseInt(product.quantity, 10);
  if (isNaN(qty) || qty < 0) {
    errors.quantity = 'Enter a valid quantity (≥ 0).';
  }

  if (!product.barcode || product.barcode.trim() === '') {
    errors.barcode = 'Barcode / QR value is required.';
  } else {
    const duplicate = existingProducts.find(
      (p) => p.barcode === product.barcode.trim() && p.id !== editingId
    );
    if (duplicate) {
      errors.barcode = 'This barcode is already assigned to another product.';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Truncate a string to `maxLength` with an ellipsis.
 */
export const truncate = (str, maxLength = 24) =>
  str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;
