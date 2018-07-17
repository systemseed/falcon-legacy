import React, { Component, PropTypes } from 'react';
import Form from 'react-jsonschema-form';
import { Col, Row, Image } from 'react-bootstrap';
import EmailIcon from '../../components/EmailIcon';
import PostIcon from '../../components/PostIcon';

class ProductCardItem extends Component {
  // Modified copy of https://github.com/mozilla-services/react-jsonschema-form/blob/master/src/components/widgets/RadioWidget.js
  cardRadioWidget = (props) => {
    // eslint-disable-next-line
    const {options, value, required, disabled, readonly, autofocus, onChange} = props;
    // Generating a unique field name to identify this set of radio buttons
    const name = Math.random().toString();
    const { enumOptions } = options;
    // checked={checked} has been moved above name={name}, As mentioned in #349;
    // this is a temporary fix for radio button rendering bug in React, facebook/react#7630.
    return (
      <div className="field-radio-group card-radio-widget">
        {enumOptions.map((option, i) => {
          const image = options[option.value].image;
          const checked = option.value === value;
          const checkedCls = checked ? ' checked' : '';
          const radio = (
            <div className="option-wrapper-inner">
              <input
                type="radio"
                checked={checked}
                name={name}
                required={required}
                value={option.value}
                disabled={disabled || readonly}
                autoFocus={autofocus && i === 0}
                onChange={_ => onChange(option.value)} // eslint-disable-line no-unused-vars
              />
              <div className="option-text">
                {option.value === 'physical' && <PostIcon />}
                {option.value === 'email' && <EmailIcon />}
                {option.label}
              </div>
              <div className="option-image">
                <Image src={image.src} alt={image.alt} responsive />
              </div>
            </div>
          );

          return <label key={i} className={`col-xs-6 option-wrapper${checkedCls}`}>{radio}</label>; // eslint-disable-line
        })}
      </div>
    );
  };

  widgets = {
    cardRadioWidget: this.cardRadioWidget
  };

  typeSchema = {
    title: '',
    type: 'string',
    enum: ['physical', 'email'],
    enumNames: ['By Post', 'By Email']
  };

  typeUiSchema = {
    'ui:widget': 'cardRadioWidget',
  };

  state = {
    type: this.props.cardItem.type
  };

  onChangeType({ formData }) {
    this.setState({ type: formData });
    this.props.onChangeType(this.props.cardItem.cardIndex, formData);
  }

  onPreviewClick(e) {
    e.preventDefault();
    this.props.onPreviewOpen(this.props.cardItem.cardIndex);
  }

  render() {
    const { cardItem } = this.props;

    // Add images information.
    this.typeUiSchema['ui:options'] = {
      physical: {
        image: cardItem.product.postalPreviewImage.src ? cardItem.product.postalPreviewImage : cardItem.product.whatYouGetImage
      },
      email: {
        image: cardItem.product.ecardPreviewImage.src ? cardItem.product.ecardPreviewImage : { src: cardItem.product.imageUrl, alt: cardItem.product.imageAlt }
      }
    };

    return (
      <div className="card-product">
        <Row>
          <Col xs={12} className="card-title">
            <span>Send a Gift Card for {cardItem.product.title}
            {
              cardItem.total > 1 &&
              <span> ({cardItem.index} of {cardItem.total})</span>
            }
            :</span>
          </Col>
        </Row>
        <Row>
          <Form
            schema={this.typeSchema}
            uiSchema={this.typeUiSchema}
            formData={this.state.type}
            onChange={this.onChangeType.bind(this)}
            widgets={this.widgets}
          ><button type="submit" style={{ display: 'none' }} /></Form>
        </Row>
        <Row className="card-preview">
          <Col xs={6} className="card-preview-postal">
            {
              cardItem.type === 'physical' &&
              <a
                href="#postal"
                onClick={this.onPreviewClick.bind(this)}
              >
                Preview Postal Card
              </a>
            }
          </Col>
          <Col xs={6} className="card-preview-email">
            {
              cardItem.type === 'email' &&
              <a
                href="#email"
                onClick={this.onPreviewClick.bind(this)}
              >
                Preview E-Card
              </a>
            }
          </Col>
        </Row>
      </div>
    );
  }
}

ProductCardItem.propTypes = {
  cardItem: PropTypes.object.isRequired,
  onChangeType: PropTypes.func.isRequired,
  onPreviewOpen: PropTypes.func.isRequired,
};

export default ProductCardItem;
