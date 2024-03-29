import nc from 'next-connect';
import FormatResponse from 'response-format';
import verifyJwt from '@backend/middleware/verifyJwt';
import userModal from '@backend/models/userModal';
const handler = nc()
  .use(verifyJwt)
  .get(async (req, res) => {
    try {
      const { id } = req.payload;
      const user = await userModal.findOne({ _id: id });

      return res.status(200).json(FormatResponse.success('Success', user));
    } catch (error) {
      return res.status(400).json(FormatResponse.badRequest(error.message, {}));
    }
  });

export default handler;
