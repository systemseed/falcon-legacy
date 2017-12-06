import React from 'react';
import Metatags from '../../components/Metatags';
import BasketContainer from '../../containers/BasketContainer';

const BasketView = () => (
  <div>
    <Metatags metatags={{"title": {"attributes": {"content": "Your shopping basket | Falcon Gifts"}}}} />
    <BasketContainer />
  </div>
);

export default BasketView;
