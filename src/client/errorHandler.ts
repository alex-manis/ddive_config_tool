// Handle and display errors to the user
export function handleError(message: string, error?: any) {
  console.error(message, error);
  alert(message);
}