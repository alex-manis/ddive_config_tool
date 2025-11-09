/**
 * Централизованный обработчик ошибок. Отображает сообщение пользователю.
 * @param message Сообщение об ошибке для пользователя.
 * @param error Оригинальный объект ошибки для логирования.
 */
export function handleError(message, error) {
    console.error(message, error);
    alert(message);
}
