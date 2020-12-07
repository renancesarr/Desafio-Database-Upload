import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import CustomTransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Resquest {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Resquest): Promise<void> {
    const transactionsRepository = getCustomRepository(
      CustomTransactionsRepository,
    );

    if (!isUuid(id)) {
      throw new AppError('Invalid ID format!');
    }

    const transaction = await transactionsRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new AppError('Transaction is not exists in database!', 404);
    }
    const deletado = await transactionsRepository.delete(transaction.id);

    if (deletado.affected && deletado.affected > 0) {
      throw new AppError('', 204);
    }
  }
}

export default DeleteTransactionService;
