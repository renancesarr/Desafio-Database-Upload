import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsIn = await this.find({
      select: ['value'],
      where: { type: 'income' },
    });
    let income = 0;
    transactionsIn.forEach(trasation => {
      income += trasation.value;
    });
    const transactionsOut = await this.find({
      select: ['value'],
      where: { type: 'outcome' },
    });
    let outcome = 0;
    transactionsOut.forEach(trasation => {
      outcome += trasation.value;
    });

    return {
      income,
      outcome,
      total: income - outcome,
    };
    // TODO
  }
}

export default TransactionsRepository;
