// app/models/Campaign.js
import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
  },
  offerDetails: {
    type: String,
    required: true,
  },
  emailContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Puoi aggiungere altri campi come stato della campagna, data di invio, ecc.
});

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);