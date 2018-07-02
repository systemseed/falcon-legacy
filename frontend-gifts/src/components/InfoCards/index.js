import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import InfoCard from '../../components/InfoCard';

const InfoCards = ({title, infoCardsData}) => {
  // If there is odd number of InfoCards - pop last one
  // to render it centered below other cards.
  let lastInfoCardData = false;
  if (infoCardsData.length % 2 !== 0) {
    lastInfoCardData = infoCardsData.pop();
  }

  return (
    <Grid bsClass="">
      <h3 className="text-center">
        {title}
      </h3>

      <Row className="">
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
        {lastInfoCardData &&
        <Col
          key={lastInfoCardData.uuid}
          xs={12}
          md={6}
          mdOffset={3}
        >
          <div className="info-card">
            <InfoCard
              title={lastInfoCardData.title}
              description={lastInfoCardData.description}
              imageUrl={lastInfoCardData.image}
            />
          </div>

        </Col>
        }
      </Row>
    </Grid>
  );
};


InfoCards.propTypes = {
  title: React.PropTypes.string,
  infoCardsData: React.PropTypes.array,
};

export default InfoCards;
