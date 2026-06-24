import { CapturaCompletaCedulaUseCase, CapturaCompletaResult } from './capturaCompletaCedula_UseCase';

export class SyncCedulasUseCase {
  constructor(private capturaCompletaCedulaUseCase: CapturaCompletaCedulaUseCase) {}

  async execute(payloads: Record<string, any>[]): Promise<CapturaCompletaResult[]> {
    const results: CapturaCompletaResult[] = [];
    
    // Process each sequentially
    for (const payload of payloads) {
      try {
        const result = await this.capturaCompletaCedulaUseCase.execute(payload);
        results.push(result);
      } catch (error: any) {
        throw new Error(`Error processing cedula: ${error?.message}`);
      }
    }

    return results;
  }
}
