import { VALIDATION_RULES } from '../constants'

export function useFormValidation() {
  function requiredRule(value) {
    return !!value || 'Este campo es requerido'
  }

  function minLengthRule(min) {
    return (value) => {
      if (!value) return true
      return value.length >= min 
        || `Debe tener al menos ${min} caracteres`
    }
  }

  function maxLengthRule(max) {
    return (value) => {
      if (!value) return true
      return value.length <= max 
        || `No debe exceder ${max} caracteres`
    }
  }

  function emailRule(value) {
    if (!value) return true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || 'Email inválido'
  }

  function phoneRule(value) {
    if (!value) return true
    const phoneRegex = /^3\d{9}$/
    return phoneRegex.test(value) 
      || 'El teléfono debe tener 10 dígitos y comenzar con 3'
  }

  function nitRule(value) {
    if (!value) return true
    // Sin usar includes - buscar espacios con while loop
    let hasSpace = false
    let charIndex = 0
    while (charIndex < value.length && !hasSpace) {
      if (value[charIndex] === ' ') {
        hasSpace = true
      }
      charIndex++
    }
    return (
      value.length >= VALIDATION_RULES.MIN_NIT_LENGTH && 
      value.length <= VALIDATION_RULES.MAX_NIT_LENGTH &&
      !hasSpace
    ) || `El NIT debe tener entre ${VALIDATION_RULES.MIN_NIT_LENGTH} y ${VALIDATION_RULES.MAX_NIT_LENGTH} dígitos sin espacios`
  }

  function numericRule(value) {
    if (!value && value !== 0) return true
    return !isNaN(value) || 'Debe ser un número'
  }

  function positiveNumberRule(value) {
    if (!value && value !== 0) return true
    return (value > 0) || 'Debe ser mayor a 0'
  }

  function nonNegativeNumberRule(value) {
    if (!value && value !== 0) return true
    return (value >= 0) || 'No puede ser negativo'
  }

  function alphanumericRule(value) {
    if (!value) return true
    const regex = /^[a-zA-ZÀ-ÿ0-9\s.]+$/
    return regex.test(value) || 'Solo debe contener letras, números, espacios y puntos'
  }

  function lettersOnlyRule(value) {
    if (!value) return true
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/
    return regex.test(value) || 'Solo debe contener letras y espacios'
  }

  function noSpacesRule(value) {
    if (!value) return true
    // Sin usar includes - buscar espacios con while loop
    let charIndex = 0
    while (charIndex < value.length) {
      if (value[charIndex] === ' ') {
        return 'No debe contener espacios'
      }
      charIndex++
    }
    return true
  }

  return {
    requiredRule,
    minLengthRule,
    maxLengthRule,
    emailRule,
    phoneRule,
    nitRule,
    numericRule,
    positiveNumberRule,
    nonNegativeNumberRule,
    alphanumericRule,
    lettersOnlyRule,
    noSpacesRule
  }
}

