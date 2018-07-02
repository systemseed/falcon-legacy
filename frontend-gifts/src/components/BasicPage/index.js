import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import InfoCards from '../../components/InfoCards';
import GiftsCorporateContainer from '../../containers/GiftsCorporateContainer';

const BasicPage = ({ page, corporate }) => {
  const paragraphs = [];
  if (Object.prototype.hasOwnProperty.call(page, 'paragraphBlocks')) {
    if (Object.prototype.hasOwnProperty.call(page.paragraphBlocks, 'infoCards')) {
      paragraphs.push(<InfoCards title={page.title} infoCardsData={page.paragraphBlocks.infoCards} />);
    }
  }

  return (
    <Grid componentClass="section" className="basic-page">
      <div className="bg-white padding-top-3x padding-bottom-2x padding-horizontal-150-xl">
        <Row>
          <Col xs={12}>
            {!corporate &&
            <PageHeader>{page.title}</PageHeader>}

            {page.body &&
            <div dangerouslySetInnerHTML={{ __html: page.body.value }} />}

            <div>
              {paragraphs}

              {corporate &&
              <GiftsCorporateContainer />}
            </div>

          </Col>
        </Row>
      </div>
    </Grid>
  );
};

BasicPage.propTypes = {
  page: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
    body: React.PropTypes.shape({
      value: React.PropTypes.string,
      summary: React.PropTypes.string,
      format: React.PropTypes.string,
    }),
  }).isRequired,
  corporate: React.PropTypes.bool,
};

export default BasicPage;
