/**
   * Retorna o dado numérico formatado com pelo menos dois algarismos
   * @param input 
   * @returns string
   */
export var returnData = function(input: number): string {
  return input >= 10 ? input.toString() : `0${input}`;
}