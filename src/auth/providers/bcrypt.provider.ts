import * as bcrypt from 'bcrypt';

import { HashingProvider } from './hashing.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProvider implements HashingProvider {
  
  public async hashPassword(data: string | Buffer): Promise<string> {
    // Generate salt with 20 rounds
    const salt = await bcrypt.genSalt(20); 
    
    // Hashing the data (password) with the generated salt
    return bcrypt.hash(data, salt);
}

  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    //  Compare hashed data with encrypted data
    return bcrypt.compare(data, encrypted);
  }
}
