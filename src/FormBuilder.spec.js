'use strict';
import Harness from '../test/harness';
import FormBuilder from "./FormBuilder";
import assert from 'power-assert';
describe('Formio Form Builder tests', () => {
  before((done) => Harness.builderBefore(done));
  after(() => Harness.builderAfter());
  it('Should create a new form builder class', (done) => {
    let builder = Harness.buildComponent('textfield');
    assert(builder instanceof FormBuilder, 'Builder must be an instance of FormioFormBuilder');
    done();
  });
});