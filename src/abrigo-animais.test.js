import { AbrigoAnimais } from "./abrigo-animais.js";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve retornar erro para string de animais vazia', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO', 'BOLA', '');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve retornar erro para string de animais com apenas vírgulas', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO', 'BOLA', ',,');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve retornar erro para animais duplicados na lista', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO', 'BOLA', 'Rex,Rex');
    expect(resultado.erro).toBe('Animal inválido');
  });

  test('Deve retornar erro para brinquedo inválido (não existe)', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('PEDRA', 'BOLA', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve retornar erro para brinquedos duplicados na lista de uma pessoa', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,BOLA', 'RATO', 'Rex');
    expect(resultado.erro).toBe('Brinquedo inválido');
  });

  test('Deve lidar corretamente com listas de brinquedos vazias para as pessoas', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('', '', 'Rex,Mimi');
    expect(resultado.lista).toEqual(['Mimi - abrigo', 'Rex - abrigo']);
    expect(resultado.erro).toBeFalsy();
  });

  test('Deve enviar para o abrigo se ambas as pessoas puderem adotar', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'LASER,RATO,BOLA', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

  test('Deve testar a regra "ordemImporta: false"', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,SKATE', 'BOLA', 'Loco');
    expect(resultado.lista).toEqual(['Loco - pessoa 1']);
  });

  test('Não deve adotar animal se a ordem dos brinquedos estiver incorreta', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,RATO', 'LASER', 'Rex');
    expect(resultado.lista).toEqual(['Rex - abrigo']);
  });

  test('Deve respeitar a regra "divideBrinquedos: false"', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA,LASER', '', 'Zero,Mimi');
    expect(resultado.lista).toEqual(['Mimi - abrigo', 'Zero - pessoa 1']);
  });

  test('Deve permitir adoção com "divideBrinquedos: true"', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('LASER,RATO,BOLA', '', 'Rex,Bebe');
    expect(resultado.lista).toEqual(['Bebe - pessoa 1', 'Rex - pessoa 1']);
  });

  test('Deve respeitar o limite de 3 animais por pessoa', () => {
    
    const animais = 'Rex,Bola,Bebe,Loco'; 
    const brinquedosPessoa1 = 'CAIXA,NOVELO,LASER,RATO,BOLA,SKATE';
    const resultado = new AbrigoAnimais().encontraPessoas(brinquedosPessoa1, '', animais);

    expect(resultado.lista).toContain('Rex - pessoa 1');
    expect(resultado.lista).toContain('Bola - pessoa 1');
    expect(resultado.lista).toContain('Bebe - pessoa 1');
    expect(resultado.lista).toContain('Loco - abrigo');
    expect(resultado.lista.length).toBe(4);
  });

});
