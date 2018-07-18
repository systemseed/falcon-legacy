import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import BlockSubheading from '../Paragraphs/BlockSubheading';
import BlockInfoCard from '../Paragraphs/BlockInfoCard';

// React cannot render component dynamicly by its name in string format.
// The easiest way to work around it is to create a map between string name
// and React component.
export const getComponentByBlockType = (type) => {
  const BlockComponents = {
    'subheading': BlockSubheading,
    'info_card': BlockInfoCard,
  };

  return BlockComponents[type];
};

const BasicPage = ({ page, children }) => {
  // Render paragraph blocks if any.
  const blocks = page.blocks.map((block) => {
    const Component = getComponentByBlockType(block.type);
    const { uuid, type, ...blockProps, } = block;
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

            {/* Any extra children if exist. */}
            {children}

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
  children: React.PropTypes.node
};

export default BasicPage;
