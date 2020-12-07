import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import TransactionRespository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: string;
  categoryName: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryName,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRespository);
    const categoryService = new CreateCategoryService();
    // TODO

    const category = await categoryService.execute({ title: categoryName });

    if (!this.verifyType) {
      throw new AppError('Invalid type of the transation');
    }

    if (
      type === 'outcome' &&
      (await (await transactionRepository.getBalance()).total) < value
    ) {
      throw new AppError('Invalid value for you balance');
    }
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }

  private verifyType(type: string): boolean {
    if (type === 'income' || type === 'outcome') {
      return true;
    }
    return false;
  }
}

export default CreateTransactionService;
