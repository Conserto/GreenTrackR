import type { ButtonTypeEnum } from 'src/enum';

export interface Action {
  id: string;
  buttonType: ButtonTypeEnum;
  translateKey: string;
}
