import React from 'react';
import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

const BasicPage = ({ page }) => (
  <Grid componentClass="section" className="basic-page padding-top-3x">
    <Row>
      <Col xs={12}>
        <PageHeader>{page.title}</PageHeader>
        <div dangerouslySetInnerHTML={{ __html: page.body.value }} />
      </Col>
    </Row>
  </Grid>
);

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
};

export default BasicPage;
