import express from 'express';
import cookieParser from 'cookie-parser';
import { CreateUserControllerFactory } from '@application/factories/CreateUserControllerFactory';
import { CreateRecordControllerFactory } from '@application/factories/CreateRecordControllerFactory';
import { ListRecordControllerFactory } from '@application/factories/ListRecordControllerFactory';
import { SignInUserControllerFactory } from '@application/factories/SignInUserControllerFactory';
import { auth } from '@infrastructure/middleware/auth.middleware';
import { isAdmin } from '@infrastructure/middleware/role.middleware';
// import ExpressRoutesAdapter from '@app/infrastructure/adapters/expressjs/express-routes.adapter';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const createUserController = CreateUserControllerFactory.make();
const createRecordController = CreateRecordControllerFactory.make();
const listRecordController = ListRecordControllerFactory.make();
const signInUserController = SignInUserControllerFactory.make();

app.post('/sign-up', (req, res) => createUserController.handle(req, res));
app.post('/sign-in', (req, res) => signInUserController.handle(req, res));
app.post('/record', auth, isAdmin, (req, res) => createRecordController.handle(req, res));
app.get('/record', auth, isAdmin, (req, res) => listRecordController.handle(req, res));



app.listen(PORT, () => console.log(`online, app listing on port: ${PORT}`));
