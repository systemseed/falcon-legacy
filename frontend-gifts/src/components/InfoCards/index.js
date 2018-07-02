import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import InfoCard from '../../components/InfoCard';

const InfoCards = ({ title, infoCardsData }) => (
  <Grid bsClass="">
    <h3 className="text-center">
      {title}
    </h3>

    <Row className="row-eq-height--md">
      {/* The first tile */}
      {infoCardsData.map(infoCardData => (
        <Col
          key={infoCardData.uuid}
          xs={12}
          md={6}
        >
          <InfoCard
            title={infoCardData.title}
            description={infoCardData.description}
            imageUrl={infoCardData.image}
          />

        </Col>
        ))}
    </Row>
  </Grid>
);


InfoCards.propTypes = {
  title: React.PropTypes.string,
  infoCardsData: React.PropTypes.object,
};

export default InfoCards;
