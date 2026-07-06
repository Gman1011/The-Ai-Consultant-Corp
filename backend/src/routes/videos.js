import express from 'express';
import { renderVideo, getCompositionConfig } from '../services/videoService.js';

const router = express.Router();

router.post('/render', async (req, res) => {
  try {
    const { compositionId, options } = req.body;

    if (!compositionId) {
      return res.status(400).json({
        error: 'compositionId is required',
      });
    }

    const config = getCompositionConfig(compositionId);
    if (!config) {
      return res.status(404).json({
        error: `Composition "${compositionId}" not found`,
      });
    }

    const result = await renderVideo(compositionId, {
      ...config,
      ...options,
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
