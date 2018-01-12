import React from 'react';
import Header from '../components/Header';
import HeroBlock from '../components/HeroBlock';
import HeadlineWithCopy from '../components/HeadlineWithCopy';
import Video from '../components/Video';
import TextBlock from '../components/TextBlock';
import MoneyHandles from '../components/MoneyHandles';
import ListWithImages from '../components/ListWithImages';
import ButtonWithHeader from '../components/ButtonWithHeader';
import Subscriptions from '../components/Subscriptions';
import HtmlHead from '../components/HtmlHead';

export default () =>
  <div>
    <HtmlHead/>
    <Header/>
    <HeroBlock/>
    <HeadlineWithCopy/>
    <Video/>
    <TextBlock/>
    <MoneyHandles/>
    <ListWithImages/>
    <ButtonWithHeader/>
    <Subscriptions/>
  </div>
