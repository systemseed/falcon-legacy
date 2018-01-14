import React from 'react';
import Header from '../components/organisms/SiteHeader';
import HeroBlock from '../components/organisms/HeroBlock';
import Video from '../components/organisms/Video';
import TextBlock from '../components/organisms/TextBlock';
import MoneyHandles from '../components/organisms/MoneyHandles';
import ListWithImages from '../components/organisms/ListWithImages';
import ButtonWithHeader from '../components/organisms/ButtonWithHeader';
import Subscriptions from '../components/tmp/Subscriptions';
import HtmlHead from '../components/organisms/HtmlHead';
import OneColumn from '../components/templates/OneColumn';
import PageTitleWithCopy from '../components/organisms/PageTitleWithCopy';

export default () =>
  <OneColumn>
    <HtmlHead/>
    <Header imageUrl="/static/images/logo.png" slogan="#TT2 #mumtomum <span className='d-none d-xl-block'>#giveahandtoamum</span>"/>
    {/*<HeroBlock/>*/}
    <PageTitleWithCopy/>
    {/*<Video/>*/}
    {/*<TextBlock/>*/}
    {/*<MoneyHandles/>*/}
    {/*<ListWithImages/>*/}
    {/*<ButtonWithHeader/>*/}
    {/*<Subscriptions/>*/}
  </OneColumn>
