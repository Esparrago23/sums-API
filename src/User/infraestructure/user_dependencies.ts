// src/User/infraestructure/user_dependencies.ts
import { InMemoryUserRepository } from './repositories/inMemoryUserRepository';

import { CreateUserUseCase } from '../application/createUser_UseCase';
import { ReadAllUserUseCase } from '../application/readAllUser_UseCase';
import { DeleteUserUseCase } from '../application/deleteUser_UseCase';
import { ReadUserByIDUseCase } from '../application/readUserById_UseCase';
import { UpdateUserUseCase } from '../application/updateUser_UseCase';
import { LoginUserUseCase } from '../application/loginUser_UseCase';
import { CreateEntrevistadorUserUseCase } from '../application/createEntrevistadorUser_UseCase';

// Add these missing controller imports
import { CreateUser_Controller } from './controller/createUser_Controller';
import { ReadAllUser_Controller } from './controller/readAllUser_Controller';
import { DeleteUser_Controller } from './controller/deleteUser_Controller';
import { ReadUserById_Controller } from './controller/readUserById_Controller';
import { UpdateUser_Controller } from './controller/updateUser_Controller';
import { LoginUser_Controller } from './controller/loginUser_Controller';
import { CreateEntrevistadorUserController } from './controller/createEntrevistadorUser_Controller';

export const userRepository = new InMemoryUserRepository();

export const createUserUseCase = new CreateUserUseCase(userRepository);
export const readAllUserUseCase = new ReadAllUserUseCase(userRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);
export const readUserByIDUseCase = new ReadUserByIDUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const loginUserUseCase = new LoginUserUseCase(userRepository);
export const createEntrevistadorUserUseCase = new CreateEntrevistadorUserUseCase();

// Export controllers
export const createUserController = new CreateUser_Controller(createUserUseCase);
export const readAllUserController = new ReadAllUser_Controller(readAllUserUseCase);
export const deleteUserController = new DeleteUser_Controller(deleteUserUseCase);
export const readUserByIdController = new ReadUserById_Controller(readUserByIDUseCase);
export const updateUserController = new UpdateUser_Controller(updateUserUseCase);
export const loginUserController = new LoginUser_Controller(loginUserUseCase);
export const createEntrevistadorUserController = new CreateEntrevistadorUserController(createEntrevistadorUserUseCase);
