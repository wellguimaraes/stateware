import getDependencies from '../src/getDependencies';
import { expect } from 'chai';

describe('getDependencies', () => {

  it('should get non-function value dependency', () => {
    let shape = {alpha: 1};

    const dependencies = getDependencies(shape, 'alpha');

    expect(dependencies).to.deep.equal('alpha');
  });

  it('should get single level fn dependencies', () => {
    let shape = {
      alpha: 1,
      bravo: alpha => alpha * 2
    };

    const dependencies = getDependencies(shape, 'bravo');

    expect(dependencies).to.deep.equal([ 'alpha' ]);
  });

  it('should get multiple level fn dependencies', () => {
    let shape = {
      alpha  : 1,
      bravo  : 2,
      charlie: 3,
      delta  : (alpha, bravo) => alpha * 2,
      echo   : (delta, charlie) => delta + charlie
    };

    const deltaDeps = getDependencies(shape, 'delta');
    const echoDeps  = getDependencies(shape, 'echo');

    expect(deltaDeps).to.deep.equal([ 'alpha', 'bravo' ]);
    expect(echoDeps).to.deep.equal([ 'alpha', 'bravo', 'charlie' ]);
  });
});