import React from 'react';
import PropTypes from 'prop-types';
import DonationButton from '../../atoms/DonationButton';
import Form from '../../atoms/Form';
import GeoPosition from '../../atoms/GeoPosition';

// const DonationFormBlock = ({ currency, singleDonationUrl, regularDonationUrl, paypalDonationUrl, predefinedValues, buttonText }) => {
//   return (
//     <div className="donation-form-block">
//       <div className="predefined-values">
//         <input type="radio" name="predefined_value" id="predefined_value_1" /><label for="predefined_value_1">£10</label>
//         <input type="radio" name="predefined_value" id="predefined_value_2" /><label for="predefined_value_2">£20</label>
//         <input type="radio" name="predefined_value" id="predefined_value_3" /><label for="predefined_value_3">£30</label>
//       </div>
//       <div>
//         <input type="text" className="donation-amount" aria-label="£0.00" />
//       </div>
//       <div>
//         <div className="donate-monthly">
//           <input type="checkbox" name="donate_monthly" id="donate-monthly"/><label for="donate-monthly">Donate Monthly</label>
//         </div>
//         <button type="button" className="donate-by-paypal btn-with-border">Paypal</button>
//       </div>
//
//       <DonationButton donationUrl={singleDonationUrl}>{buttonText}</DonationButton>
//     </div>
//   );
// };
// export default DonationFormBlock;


const fields = {geo: GeoPosition};

const schema = {
  type: 'object',
  // required: ['amount'],
  properties: {
    amount_wrapper: {
      type: "object",
      properties: {
        predefined_amount: {
          type: 'string',
          enum: [1, 2, 3],
          enumNames: ["one", "two", "three"]
        },
        amount: {
          type: 'number',
          classNames: "task-title foo-bar"
        },
      },
    },
    donate_monthly: {
      type: 'boolean',
      classNames: "task-title foo-bar",
      default: true,
    },
    paypal_button: {
      type: "object",
      properties: {
        isClicked: { type: "boolean" }
      }
    },
  }
};

const uiSchema = {

  amount_wrapper: {
    predefined_amount: {
      'ui:widget': 'radio',
      "ui:options": {
        label: false
      }
    },
    amount: {
      classNames: "donation-amount",
      "ui:options": {
        label: false
      }
    },
  },
  'donate_monthly': {
    'ui:widget': 'checkbox',
    "ui:options": {
      label: false
    },
  },
  'paypal_button': {
    "ui:options": {
      label: false
    },
    "ui:field": "geo"
  },
};

class DonationForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
      formData: {},
      amount: 0,
      submitType: 'default',
    };

    this.submitForm.bind(this);
    this.handleChange.bind(this);
  }

  handleChange({ formData }) {
    console.log('handleChange', formData);
    // console.log('handleChange', this.state);
    if (formData.paypal_button.isClicked) {
      this.setState({
        submitType: 'paypal',
        formData,
      });
      this.submitForm({ formData });
    }

    let formDataClone = {...formData};
    formDataClone.amount_wrapper.amount = formData.amount_wrapper.predefined_amount;

    //console.log(formDataClone);
    this.setState({
      isSending: true,
      amount: formData.amount_wrapper.amount,
      formData: {...formData,
        amount_wrapper: {
          amount: formData.amount_wrapper.predefined_amount,
          predefined_amount: 2
        }
      }
    });
  }

  submitForm({ formData }) {
    const { regularDonationUrl, singleDonationUrl } = this.props;
    let donationUrl = formData.donate_monthly ? regularDonationUrl : singleDonationUrl;

    let queryParams = [];
    if (this.state.amount > 0) {
      queryParams.push('amount=' + this.state.amount);
    }
    if (this.state.submitType !== 'default') {
      queryParams.push('method=' + this.state.submitType);
    }
    if (queryParams.length > 0) {
      donationUrl += '?' + queryParams.join('&');
    }
    let aaa = {...formData};
    aaa.amount_wrapper.amount = 99;

    this.setState({
      isSending: true,
      submitType: 'default',
      formData: aaa
    });

    console.log('donationUrl', donationUrl);
    console.log('submitForm', formData);
    console.log('submitForm props', this.props);

    //window.location = donationUrl;
  }

  render() {
    console.log('render', this.state);
    return(
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        autocomplete={'off'}
        onSubmit={this.submitForm.bind(this)}
        onChange={this.handleChange.bind(this)}
        fields={fields}
      >
        Login
        {/*<DonationButton block>*/}
          {/*Login*/}
        {/*</DonationButton>*/}
      </Form>
    );
  }
}

DonationForm.propTypes = {
  currency: PropTypes.string,
  singleDonationUrl: PropTypes.string,
  regularDonationUrl: PropTypes.string,
  paypalDonationUrl: PropTypes.string,
  predefinedValues: PropTypes.arrayOf(PropTypes.number),
  buttonText: PropTypes.string
};

export default DonationForm;