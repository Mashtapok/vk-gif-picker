export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  delay: number,
): (...args: Params) => any {
  let timeout: any;

  return function executedFunction(...args: Params) {
    clearTimeout(timeout);

    timeout = setTimeout(() => func(...args), delay);
  };
}

/**
 * Выбирает из объекта поля с нужными ключами. Возвращает объект
 *
 * Например: pick({bad: ..., good: ..., fine: ..., worth:...} , ['good', 'fine']) вернёт {good: ..., fine:...}
 */
export function pick<T extends object, U extends keyof T>(object: T, pick: Array<U>): Pick<T, U> {
  const res: Partial<T> = {};
  pick.forEach((key: U) => {
    if (object[key] !== undefined) {
      res[key] = object[key];
    }
  });
  return res as Pick<T, U>;
}
