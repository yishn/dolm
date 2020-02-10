export interface TranslatedStrings {
  [context: string]: {
    [key: string]: string | ((p: {}) => string)
  }
}

export interface DolmInstance {
  load(newStrings: TranslatedStrings): void

  t(context: string, input: string): string
  t<P>(context: string, input: (p: P) => string, params: P): string

  context(
    context: string
  ): ((input: string) => string) &
    (<P>(input: (p: P) => string, params: P) => string)
}

export function getKey(input: string): string
export function getKey<P>(input: (p: P) => string, params: P): string

export function load(strings: TranslatedStrings): DolmInstance
