export const getErrorMessage = (error: any) => {
  let errorMessage: string = ''

  if (typeof error === 'string') {
    errorMessage = error
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'object' && error !== null) {
    const errorObject = error as Record<string, string>
    const firstErrorKey = Object.keys(errorObject)[0]
    errorMessage = errorObject[firstErrorKey]
  }

  return errorMessage
}