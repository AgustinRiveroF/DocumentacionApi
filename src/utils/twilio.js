import twilio from 'twilio';
import config from '../dao/config/config.js';

export const client = twilio(
    config.twilio_account,
    config.twilio_auth
);