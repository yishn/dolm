export interface TranslatedStrings {
  [context: string]: {
    [key: string]: string | ((p: {}) => string)
  }
}

export type TranslationFunction = ((input: string) => string) &
  (<P>(input: (p: P) => string, params: P) => string)

export type GetKeyFunction = ((input: string) => string) &
  (<P>(input: (p: P) => string, params: P) => string)

export interface DolmInstance {
  load(newStrings: TranslatedStrings): void

  t(context: string, input: string): string
  t<P>(context: string, input: (p: P) => string, params: P): string

  context(context: string): TranslationFunction
}

export const getKey: GetKeyFunction

export function load(
  strings: TranslatedStrings,
  getKey?: GetKeyFunction
): DolmInstance
