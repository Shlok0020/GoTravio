import Brevo from '@getbrevo/brevo';

// Create API instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// Attach API Key from Render ENV
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export default apiInstance;
