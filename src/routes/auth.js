import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema,confirmOAuthSchema } from '../validation/authSchemas.js';
import { registerController, loginController, refreshController, logoutController,sendResetEmailController,
  resetPasswordController,getOAuthURLController,
  confirmOAuthController } from '../controllers/auth.js';
import { sendResetEmailSchema, resetPasswordSchema } from '../validation/authSchemas.js';


const router = Router();


router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', ctrlWrapper(logoutController));

router.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));


router.get("/get-oauth-url", getOAuthURLController);
router.post("/confirm-oauth", validateBody(confirmOAuthSchema), confirmOAuthController);
export default router;
