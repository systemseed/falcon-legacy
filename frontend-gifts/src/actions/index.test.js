import * as actions from './index';
import * as types from '../actiontypes';

describe('actions', () =>{
  it ('should switch to EUR currency', () => {
    const currency = {'EUR': 'Euro'};
    const expected = {
      type: types.SWITCH_CURRENCY,
      currency: {'EUR': 'Euro'}
    };
    expect(actions.switchCurrency(currency)).toEqual(expected);
  });

  it ('should switch to GBP currency', () => {
    const currency = {'GBP': 'Sterling'};
    const expected = {
      type: types.SWITCH_CURRENCY,
      currency: {'GBP': 'Sterling'}
    };
    expect(actions.switchCurrency(currency)).toEqual(expected);
  });
});