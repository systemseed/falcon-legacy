import request from 'superagent';
import config from '../config';

/**
 * Sends contact form to the backend.
 *
 * @param formData
 * @returns {{type: string, meta: {formData: *}, payload}}
 */
export function postForm(formData) {
  return {
    type: 'POST_CONTACT_FORM',
    meta: { formData },
    payload: request
      .post(`${config.backend}/v1/gifts/contact_message`)
      .query({
        '_format': 'json'
      })
      .set('Content-Type', 'application/json')
      .send({
        'contact_form': [{ 'target_id': 'feedback' }],
        'name': [{ 'value': formData.name }],
        'mail': [{ 'value': formData.email }],
        'subject': [{ 'value': 'Contacted via Gifts' }],
        'message': [{ 'value': formData.message }]
      })

  };
}
