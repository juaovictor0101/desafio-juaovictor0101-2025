const DADOS_ANIMAIS = new Map([
  ['Rex',  { tipo: 'cão',    brinquedos: ['RATO', 'BOLA'],        ordemImporta: true,  divideBrinquedos: true }],
  ['Mimi', { tipo: 'gato',   brinquedos: ['BOLA', 'LASER'],       ordemImporta: true,  divideBrinquedos: false }],
  ['Fofo', { tipo: 'gato',   brinquedos: ['BOLA', 'RATO', 'LASER'], ordemImporta: true,  divideBrinquedos: false }],
  ['Zero', { tipo: 'gato',   brinquedos: ['RATO', 'BOLA'],        ordemImporta: true,  divideBrinquedos: false }],
  ['Bola', { tipo: 'cão',    brinquedos: ['CAIXA', 'NOVELO'],    ordemImporta: true,  divideBrinquedos: true }],
  ['Bebe', { tipo: 'cão',    brinquedos: ['LASER', 'RATO', 'BOLA'], ordemImporta: true,  divideBrinquedos: true }],
  ['Loco', { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'],       ordemImporta: false, divideBrinquedos: true }]
]);

const TODOS_BRINQUEDOS = new Set(['RATO', 'BOLA', 'LASER', 'NOVELO', 'CAIXA', 'SKATE']);

export class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1Str, brinquedosPessoa2Str, animaisConsideradosStr) {
    try {
      const animaisParaAdocao = this.#validarEProcessarAnimais(animaisConsideradosStr);
      const pessoas = [
        { id: 1, brinquedos: this.#validarEProcessarBrinquedos(brinquedosPessoa1Str), animaisAdotados: 0, brinquedosUsados: new Set() },
        { id: 2, brinquedos: this.#validarEProcessarBrinquedos(brinquedosPessoa2Str), animaisAdotados: 0, brinquedosUsados: new Set() }
      ];

      const resultadoFinal = [];

      for (const nomeAnimal of animaisParaAdocao) {
        const animal = DADOS_ANIMAIS.get(nomeAnimal);
        const adotantes = [];

        for (const pessoa of pessoas) {
          if (pessoa.animaisAdotados < 3 && this.#pessoaPodeAdotar(pessoa, animal)) {
            adotantes.push(pessoa);
          }
        }

        if (adotantes.length === 1) {
          const adotante = adotantes[0];
          adotante.animaisAdotados++;
          animal.brinquedos.forEach(b => adotante.brinquedosUsados.add(b));
          resultadoFinal.push(`${nomeAnimal} - pessoa ${adotante.id}`);
        } else {
          resultadoFinal.push(`${nomeAnimal} - abrigo`);
        }
      }

      return { lista: resultadoFinal.sort() };

    } catch (error) {
      return { erro: error.message };
    }
  }

  #validarEProcessarAnimais(animaisStr) {
    if (!animaisStr) throw new Error('Animal inválido');
    const animais = animaisStr.split(',').filter(a => a);
    if (animais.length === 0) throw new Error('Animal inválido');

    const animaisUnicos = new Set(animais);
    if (animaisUnicos.size !== animais.length) throw new Error('Animal inválido');
    for (const nome of animais) {
      if (!DADOS_ANIMAIS.has(nome)) throw new Error('Animal inválido');
    }
    return animais;
  }

  #validarEProcessarBrinquedos(brinquedosStr) {
    const brinquedos = (brinquedosStr || '').split(',').filter(b => b);

    const brinquedosUnicos = new Set(brinquedos);
    if (brinquedosUnicos.size !== brinquedos.length) throw new Error('Brinquedo inválido');
    for (const nome of brinquedos) {
      if (!TODOS_BRINQUEDOS.has(nome)) throw new Error('Brinquedo inválido');
    }
    return brinquedos;
  }

  #pessoaPodeAdotar(pessoa, animal) {
    if (!animal.divideBrinquedos) {
      for (const brinquedoAnimal of animal.brinquedos) {
        if (pessoa.brinquedosUsados.has(brinquedoAnimal)) {
          return false;
        }
      }
    }

    if (!animal.ordemImporta) {
      const brinquedosPessoaSet = new Set(pessoa.brinquedos);
      return animal.brinquedos.every(b => brinquedosPessoaSet.has(b));
    }

    let indiceBrinquedoAnimal = 0;
    for (const brinquedoPessoa of pessoa.brinquedos) {
      if (brinquedoPessoa === animal.brinquedos[indiceBrinquedoAnimal]) {
        indiceBrinquedoAnimal++;
      }
      if (indiceBrinquedoAnimal === animal.brinquedos.length) {
        return true;
      }
    }

    return false;
  }
}