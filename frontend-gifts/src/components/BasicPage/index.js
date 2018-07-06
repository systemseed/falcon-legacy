import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import GiftsCorporateContainer from '../../containers/GiftsCorporateContainer';
import BlockSubheading from '../Paragraphs/BlockSubheading';
import BlockInfoCard from '../Paragraphs/BlockInfoCard';

export const getComponentByBlockType = (type) => {
  const BlockComponents = {
    'subheading': BlockSubheading,
    'info_card': BlockInfoCard,
  };

  return BlockComponents[type];
};

const BasicPage = ({ page, corporate }) => {
  // Render paragraph blocks if any.
  const blocks = page.blocks.map((block) => {
    const Component = getComponentByBlockType(block.type);
    const { uuid, type, component, ...blockProps, } = block;
    return <Component key={block.uuid} {...blockProps} />;
  });

  return (
    <Grid componentClass="section" className="basic-page">
      <div className="bg-white padding-bottom-2x padding-horizontal-150-xl">
        <Row>
          <Col xs={12}>
            {/* Normal basic page with title and body. */}
            {page.bodyHtml &&
              <div className="padding-top-3x">
                <PageHeader>{page.title}</PageHeader>
                <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
              </div>
            }

            {/* Paragpaph blocks. */}
            <div className="blocks-wrapper">{blocks}</div>

            {/* TODO: allow to configure attached products on the backend. */}
            {corporate &&
              <GiftsCorporateContainer />}

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
