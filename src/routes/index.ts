import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('OK');
});
router.get('/test', (req, res) => {
  res.status(200).send('OK');
});
router.get('/', (req, res) => {
  res.status(200).send('OK');
});


export default router;
