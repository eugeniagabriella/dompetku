import {
  BaseModule,
  ModuleMetadata,
  codec,
  TransactionApplyContext,
} from 'lisk-sdk';

export class KasbonModule extends BaseModule {
  public name = 'kasbon';
  public id = 1000;

  public transactionAssets = [];

  public async init(_args: Record<string, unknown>): Promise<void> {}

  public async apply(_context: TransactionApplyContext): Promise<void> {
    // Kosong - tidak digunakan karena kita panggilnya via action
  }

  actions = {
    logKasbon: async ({ params }) => {
      const { user, amount } = codec.fromJSON<{ user: string; amount: number }>(params);
      console.log(`✅ Kasbon logged: ${user} - Rp${amount}`);
      return { success: true };
    },
  };
}
