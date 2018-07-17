import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';
import { generateTableOfContents } from '../../utils/page';
import TableOfContents from '../TableOfContents';


const FaqPage = ({ page }) => {
  const { tableOfContents, content } = generateTableOfContents(page.bodyHtml);

  return (
    <Grid componentClass="section" className="basic-page">
      <div className="bg-white padding-bottom-2x padding-horizontal-150-xl">
        <Row>
          <Col xs={12}>
            <div className="padding-top-3x">
              <PageHeader>{page.title}</PageHeader>
              <TableOfContents tableOfContents={tableOfContents} />
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </Col>
        </Row>
      </div>
    </Grid>
  );
};

FaqPage.propTypes = {
  page: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
    bodyHtml: React.PropTypes.string,
  }).isRequired
};

export default FaqPage;
